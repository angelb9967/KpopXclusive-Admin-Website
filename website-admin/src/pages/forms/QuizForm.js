import { MinusCircleOutlined, PlusOutlined, ProfileFilled, QuestionCircleFilled, SettingFilled, SolutionOutlined } from '@ant-design/icons';
import { BackTop, Button, Card, Checkbox, Divider, Form, Input, message, Steps } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import logo1 from '../../assets/Logo 1.png';
import '../../styles/Main.css';
import '../../styles/QuizForm.css';
const { ObjectId } = require('mongoose').Types;

const QuizForm = () => {
  const [form] = Form.useForm();
  const location = useLocation();
  const [quizData, setQuizData] = useState({
    title: '',
    objective: '',
    gameSetup: {
      playerOptions: [],
      rounds: [],
    },
    gamePlayRules: {
      imageDisplay: [],
      timer: [],
      scoringSystem: ['', ''],
    },
    questions: [],
  });

  const { state } = location;
  const buttonText = location.pathname === '/EditQuiz' ? 'Update Quiz' : 'Save Quiz';

  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  const parseScoringSystem = (scoringSystem) => {
    const correctAnswerMatch = scoringSystem[0].match(/(\d+)/);
    const incorrectAnswerMatch = scoringSystem[1].match(/(\d+)/);

    return [
      correctAnswerMatch ? parseInt(correctAnswerMatch[0], 10) : 0,
      incorrectAnswerMatch ? parseInt(incorrectAnswerMatch[0], 10) : 0,
    ];
  };

  useEffect(() => {
    if (state?.record) {
      const [correctPoints, incorrectPoints] = parseScoringSystem(state.record.gamePlayRules.scoringSystem);

      const initialQuizData = {
        ...state.record,
        gamePlayRules: {
          ...state.record.gamePlayRules,
          scoringSystem: [correctPoints, incorrectPoints], 
        },
      };

      setQuizData(initialQuizData);
      form.setFieldsValue({
        ...initialQuizData,
        gameSetup: {
          ...initialQuizData.gameSetup,
          playerOptions: initialQuizData.gameSetup.playerOptions.length > 0
            ? initialQuizData.gameSetup.playerOptions
            : [''],
          rounds: initialQuizData.gameSetup.rounds.length > 0
            ? initialQuizData.gameSetup.rounds
            : [''], 
        },
        gamePlayRules: {
          ...initialQuizData.gamePlayRules,
          imageDisplay: initialQuizData.gamePlayRules.imageDisplay.length > 0
            ? initialQuizData.gamePlayRules.imageDisplay
            : [''],
          timer: initialQuizData.gamePlayRules.timer.length > 0
            ? initialQuizData.gamePlayRules.timer
            : [''], 
        },
      });
    }
  }, [state, form]);

  useEffect(() => {
    if (state?.record) {
      const initialQuizData = {
        ...state.record,
      };

      setQuizData(initialQuizData);

      const selectedIds = initialQuizData.questions; 
      console.log("Setting selected questions:", selectedIds); 
      setSelectedQuestions(selectedIds);
    }
  }, [state]);


  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:8000/questions');
        setAvailableQuestions(response.data);
      } catch (error) {
        message.error('Failed to fetch questions');
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = async () => {
    try {
      await form.validateFields();

      setCurrentStep((prevStep) => Math.min(prevStep + 1, 3));
    } catch (error) {
      message.error('Please complete the required fields before proceeding.');
    }
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const handleValuesChange = (changedValues) => {
    const { playerOptions, title, objective, rounds, timer, imageDisplay} = changedValues;

    if (playerOptions) {
      setQuizData((prevData) => {
        const updatedPlayerOptions = [...prevData.gameSetup.playerOptions];
        playerOptions.forEach((option, index) => {
          updatedPlayerOptions[index] = option || '';
        });
        return {
          ...prevData,
          gameSetup: {
            ...prevData.gameSetup,
            playerOptions: updatedPlayerOptions,
          },
        };
      });
    }

    if (rounds) {
      setQuizData((prevData) => {
        const updatedRounds = [...prevData.gameSetup.rounds];
        rounds.forEach((option, index) => {
          updatedRounds[index] = option || '';
        });
        return {
          ...prevData,
          gameSetup: {
            ...prevData.gameSetup,
            rounds: updatedRounds,
          },
        };
      });
    }

    if (imageDisplay) {
      setQuizData((prevData) => {
        const updatedImageDisplay = [...prevData.gamePlayRules.imageDisplay];
        imageDisplay.forEach((option, index) => {
          updatedImageDisplay[index] = option || '';
        });
        return {
          ...prevData,
          gamePlayRules: {
            ...prevData.gamePlayRules,
            imageDisplay: updatedImageDisplay,
          },
        };
      });
    }

    if (timer) {
      setQuizData((prevData) => {
        const updatedTimer = [...prevData.gamePlayRules.timer];
        timer.forEach((option, index) => {
          updatedTimer[index] = option || '';
        });
        return {
          ...prevData,
          gamePlayRules: {
            ...prevData.gamePlayRules,
            timer: updatedTimer,
          },
        };
      });
    }

    if (title !== undefined) {
      setQuizData((prevData) => ({
        ...prevData,
        title: title,
      }));
    }

    if (objective !== undefined) {
      setQuizData((prevData) => ({
        ...prevData,
        objective: objective,
      }));
    }
  };

  const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
  };

  const convertQuestionsToObjectId = (questions) => {
    console.log('Filtering valid ObjectId from:', questions);
    return questions
      .filter(id => {
        const isValid = ObjectId.isValid(id);
        console.log(`ID: ${id}, Is Valid: ${isValid}`);
        return isValid;
      })
      .map(id => new ObjectId(id));
  };

  const handleSubmit = async () => {
    const correctPoints = quizData.gamePlayRules.scoringSystem[0] || 0;
    const incorrectPoints = quizData.gamePlayRules.scoringSystem[1] || 0;

    console.log("SelectedQuestions Data: ", selectedQuestions);
    const validityResults = selectedQuestions.map(isValidObjectId);
    console.log("Are selected IDs valid?", validityResults);

    if (validityResults.includes(false)) {
      message.error('One or more selected question IDs are invalid.');
      return;
    }

    if (selectedQuestions.length <= 1) {
      message.error('Please select at least two questions before submitting.');
      return;
    }

    const cleanedQuizData = {
      ...quizData,
      gameSetup: {
        ...quizData.gameSetup,
        playerOptions: quizData.gameSetup.playerOptions.filter(option => option && option.trim() !== ''),
        rounds: quizData.gameSetup.rounds.filter(round => round && round.trim() !== ''),
      },
      gamePlayRules: {
        ...quizData.gamePlayRules,
        scoringSystem: [
          `Correct Answer: ${correctPoints} point/s`,
          `Incorrect Answer: ${incorrectPoints} point/s`,
        ],
        imageDisplay: quizData.gamePlayRules.imageDisplay.filter(image => image && image.trim() !== ''),
      },
      questions: convertQuestionsToObjectId(selectedQuestions),
    };

    console.log('Cleaned Quiz Data:', cleanedQuizData);
    console.log('Questions before submission:', cleanedQuizData.questions);

    try {
      const response = location.pathname === '/EditQuiz' && cleanedQuizData._id
        ? await axios.put(`http://localhost:8000/quizzes/${cleanedQuizData._id}`, cleanedQuizData)
        : await axios.post('http://localhost:8000/quizzes', cleanedQuizData);

      message.success(response.data.message);
      form.resetFields();
      setQuizData({
        title: '',
        objective: '',
        gameSetup: {
          playerOptions: [],
          rounds: [],
        },
        gamePlayRules: {
          imageDisplay: [],
          timer: [],
          scoringSystem: [
            'Correct Answer: 0 point/s',
            'Incorrect Answer: 0 point/s',
          ],
        },
        questions: [],
      });
      setSelectedQuestions([]);
    } catch (error) {
      message.error('Failed to save or update quiz');
      console.error('Error saving or updating quiz:', error.response ? error.response.data : error.message);
    }
  };


  const handleQuestionSelection = (questionId) => {
    setSelectedQuestions((prevSelected) => {
      if (prevSelected.includes(questionId)) {
        return prevSelected.filter(id => id !== questionId);
      } else {
        return [...prevSelected, questionId];
      }
    });
  };

  return (
    <div className='quizContainer'>
      <div className='main-navbar'>
        <img src={logo1} className="main-image" alt="Logo 1" />
        <h2 className='main-title'>{location.pathname === '/EditQuiz' ? 'EDIT QUIZ' : 'ADD QUIZ'}</h2>
      </div>

      <Card style={{ width: "50%", justifySelf: "center", marginTop: "50px" }}>
        <Steps
          current={currentStep}
          items={[
            { title: 'Quiz Title', status: currentStep === 0 ? 'process' : 'wait', icon: <SolutionOutlined /> },
            { title: 'Game Setup', status: currentStep === 1 ? 'process' : 'wait', icon: <SettingFilled /> },
            { title: 'Gameplay Rules', status: currentStep === 2 ? 'process' : 'wait', icon: <ProfileFilled /> },
            { title: 'Questions', status: currentStep === 3 ? 'process' : 'wait', icon: <QuestionCircleFilled /> },
          ]}
        />

        <Form form={form} layout="vertical" onValuesChange={handleValuesChange}>
          {/* Step 1: Title */}
          {currentStep === 0 && (
            <>
              <div className='textContainer'>
                <Divider />
                <label className='heading'>Step 1: Quiz Title & Objective 🎯</label>
                <Divider />
                <label className='subheading'>Instructions</label>
                <label className='content'>Welcome to your quiz creation journey! In this step, you'll set the tone by giving your quiz a name and a clear objective.</label>
                <ul>
                  <li> Title: <strong>Make it catchy and memorable—this is what players will see first!</strong></li>
                  <li> Objective: <strong>Briefly describe the aim of your quiz. What should players expect?<br></br> For example, 'Identify the K-pop idol based on their eyes!' or 'Test your knowledge on some group members! </strong></li>
                </ul>
                <Divider />
              </div>
              <Form.Item label="Title" name="title" initialValue={quizData.title} required rules={[{ required: true, message: "Please enter the quiz title." }]}>
                <Input placeholder="Enter the quiz title here" />
              </Form.Item>
              <Form.Item label="Objective" name="objective" initialValue={quizData.objective} required rules={[{ required: true, message: "Please enter the objective." }]}>
                <Input placeholder="What is the goal of the quiz?" />
              </Form.Item>
            </>
          )}

          {/* Step 2: Game Setup */}
          {currentStep === 1 && (
            <>
              <div className='textContainer'>
                <Divider />
                <label className='heading'>Step 2: Game Setup ⚙</label>
                <Divider />
                <label className='subheading'>Instructions</label>
                <label className='content'>Time to set up the game structure! Here, you’ll define how players interact with your quiz:</label>
                <ul>
                  <li> Player Options: <strong>List the ways players can participate. Solo, teams, or both?</strong></li>
                  <li> Rounds: <strong>Describe how the rounds will be structured. Will there be multiple rounds with new images each time? Give players a hint of what’s coming!</strong></li>
                </ul>
                <Divider />
              </div>
              <Form.Item label="Player Option(s):" required>
                <Form.List
                  name="playerOptions"
                  initialValue={quizData.gameSetup.playerOptions.length > 0 ? quizData.gameSetup.playerOptions : ['']}
                  rules={[{
                    validator: async (_, playerOptions) => {
                      if (!playerOptions || playerOptions.length < 1) {
                        return Promise.reject(new Error('Please provide at least one player option.'));
                      }
                    },
                  }]}>
                  {(fields, { add, remove }, { errors }) => (
                    <>
                      {fields.map(({ key, name, fieldKey, ...restField }) => (
                        <Form.Item key={key} required={false}>
                          <Form.Item
                            {...restField}
                            name={[name]}
                            fieldKey={[fieldKey]}
                            validateTrigger={['onChange', 'onBlur']}
                            rules={[{ required: true, whitespace: true, message: "Please input a player option." }]}
                            noStyle
                          >
                            <Input
                              placeholder="Describe how the game can be played, such as whether it's solo or in teams."
                              required
                              style={{ width: '90%', marginRight: '8px' }}
                            />
                          </Form.Item>
                          {fields.length > 1 ? (
                            <MinusCircleOutlined className="dynamic-delete-button" onClick={() => remove(name)} />
                          ) : null}
                        </Form.Item>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => {
                            add();
                          }}
                          style={{ width: '90%' }}
                          icon={<PlusOutlined />}
                        >
                          Add Player Option
                        </Button>
                        <Form.ErrorList errors={errors} />
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Form.Item>

              <Form.Item label="Rounds:" required>
                <Form.List
                  name="rounds" 
                  initialValue={quizData.gameSetup.rounds.length > 0 ? quizData.gameSetup.rounds : ['']}
                  rules={[{
                    validator: async (_, rounds) => {
                      if (!rounds || rounds.length < 1) {
                        return Promise.reject(new Error('Please provide at least one round.'));
                      }
                    },
                  }]}>
                  {(fields, { add, remove }, { errors }) => (
                    <>
                      {fields.map(({ key, name, fieldKey, ...restField }) => (
                        <Form.Item key={key} required={false}>
                          <Form.Item
                            {...restField}
                            name={[name]}
                            fieldKey={[fieldKey]}
                            validateTrigger={['onChange', 'onBlur']}
                            rules={[{ required: true, whitespace: true, message: "Please input a round." }]}
                            noStyle
                          >
                            <Input
                              placeholder="Describe the rules for each round (e.g., number of rounds, image types)."
                              required
                              style={{ width: '90%', marginRight: '8px' }}
                            />
                          </Form.Item>
                          {fields.length > 1 ? (
                            <MinusCircleOutlined className="dynamic-delete-button" onClick={() => remove(name)} />
                          ) : null}
                        </Form.Item>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => {
                            add();
                          }}
                          style={{ width: '90%' }}
                          icon={<PlusOutlined />}
                        >
                          Add Round
                        </Button>
                        <Form.ErrorList errors={errors} />
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Form.Item>

            </>
          )}

          {/* Step 3: Gameplay Rules */}
          {currentStep === 2 && (
            <>
              <div className='textContainer'>
                <Divider />
                <label className='heading'>Step 3: Gameplay Rules 📜</label>
                <Divider />
                <label className='subheading'>Instructions</label>
                <label className='content'>Let’s establish the game rules so everyone knows how to play!</label>
                <ul>
                  <li> Image Display: <strong>Describe how images appear in each round (e.g., close-ups or full-face shots).</strong></li>
                  <li> Timer: <strong>Specify the time players have to answer each question. A countdown clock keeps the tension high!</strong></li>
                  <li> Scoring System: <strong>Explain how points work. Will players gain points for correct answers or lose points for incorrect ones?</strong></li>
                </ul>
                <Divider />
              </div>
              <Form.Item label="Image Display:" required>
                <Form.List
                  name="imageDisplay"
                  initialValue={quizData.gamePlayRules.imageDisplay.length > 0 ? quizData.gamePlayRules.imageDisplay : ['']}
                  rules={[{
                    validator: async (_, imageDisplay) => {
                      if (!imageDisplay || imageDisplay.length < 1) {
                        return Promise.reject(new Error('Please provide at least one image display option.'));
                      }
                    },
                  }]}>
                  {(fields, { add, remove }, { errors }) => (
                    <>
                      {fields.map(({ key, name, fieldKey, ...restField }) => (
                        <Form.Item key={key} required={false}>
                          <Form.Item
                            {...restField}
                            name={[name]}
                            fieldKey={[fieldKey]}
                            validateTrigger={['onChange', 'onBlur']}
                            rules={[{ required: true, whitespace: true, message: "Please input an image display option." }]}
                            noStyle
                          >
                            <Input
                              placeholder="Describe the image options displayed to the player (e.g., close-up of eyes, background details)."
                              required
                              style={{ width: '90%', marginRight: '8px' }}
                            />
                          </Form.Item>
                          {fields.length > 1 ? (
                            <MinusCircleOutlined className="dynamic-delete-button" onClick={() => remove(name)} />
                          ) : null}
                        </Form.Item>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => {
                            add();
                          }}
                          style={{ width: '90%' }}
                          icon={<PlusOutlined />}
                        >
                          Add Image Display Option
                        </Button>
                        <Form.ErrorList errors={errors} />
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Form.Item>

              <Form.Item label="Timer:" required>
                <Form.List
                  name="timer"
                  initialValue={quizData.gamePlayRules.timer.length > 0 ? quizData.gamePlayRules.timer : ['']}
                  rules={[{
                    validator: async (_, timer) => {
                      if (!timer || timer.length < 1) {
                        return Promise.reject(new Error('Please provide at least one timer option.'));
                      }
                    },
                  }]}>
                  {(fields, { add, remove }, { errors }) => (
                    <>
                      {fields.map(({ key, name, fieldKey, ...restField }) => (
                        <Form.Item key={key} required={false}>
                          <Form.Item
                            {...restField}
                            name={[name]}
                            fieldKey={[fieldKey]}
                            validateTrigger={['onChange', 'onBlur']}
                            rules={[{ required: true, whitespace: true, message: "Please input a timer option." }]}
                            noStyle
                          >
                            <Input
                              placeholder="Specify the time limit for each question (e.g., 10 seconds, 15 seconds)."
                              required
                              style={{ width: '90%', marginRight: '8px' }}
                            />
                          </Form.Item>
                          {fields.length > 1 ? (
                            <MinusCircleOutlined className="dynamic-delete-button" onClick={() => remove(name)} />
                          ) : null}
                        </Form.Item>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => {
                            add();
                          }}
                          style={{ width: '90%' }}
                          icon={<PlusOutlined />}
                        >
                          Add Timer Option
                        </Button>
                        <Form.ErrorList errors={errors} />
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Form.Item>

              <Divider>Scoring System</Divider>

              <Form.Item
                label="Correct Answer"
                name={["gamePlayRules", "scoringSystem", 0]}
                required
                rules={[{ required: true, message: "Please enter the points awarded for a correct answer." }]}
              >
                <Input
                  placeholder="Specify the number of points awarded for a correct answer (e.g., 10)."

                  type="number"
                  onChange={(e) => {
                    const value = e.target.value;
                    const currentScoring = quizData.gamePlayRules.scoringSystem;

                    // Update only the correct answer in the scoring system
                    setQuizData((prevData) => ({
                      ...prevData,
                      gamePlayRules: {
                        ...prevData.gamePlayRules,
                        scoringSystem: [
                          value ? parseInt(value, 10) : 0, // Update correct answer, default to 0 if empty
                          currentScoring[1], // Keep incorrect answer unchanged
                        ],
                      },
                    }));

                    // Log current values
                    console.log('Current Correct Answer:', value ? parseInt(value, 10) : 0);
                    console.log('Current Incorrect Answer:', currentScoring[1]);
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Incorrect Answer"
                name={["gamePlayRules", "scoringSystem", 1]}
                required
                rules={[{ required: true, message: "Please enter the points awarded for an incorrect answer." }]}
              >
                <Input
                  placeholder="Specify the number of points deducted or awarded for an incorrect answer (e.g., -5 or 0)."
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value;
                    const currentScoring = quizData.gamePlayRules.scoringSystem;

                    // Update only the incorrect answer in the scoring system
                    setQuizData((prevData) => ({
                      ...prevData,
                      gamePlayRules: {
                        ...prevData.gamePlayRules,
                        scoringSystem: [
                          currentScoring[0], // Keep correct answer unchanged
                          value ? parseInt(value, 10) : 0, // Update incorrect answer, default to 0 if empty
                        ],
                      },
                    }));

                    // Log current values
                    console.log('Current Correct Answer:', currentScoring[0]);
                    console.log('Current Incorrect Answer:', value ? parseInt(value, 10) : 0);
                  }}
                />
              </Form.Item>
            </>
          )}

          {/* Step 4: Questions */}
          {currentStep === 3 && (
            <>
              <div className='textContainer'>
                <Divider />
                <label className='heading'>Step 4: Question Selection ❓</label>
                <Divider />
                <label className='subheading'>Instructions</label>
                <label className='content'>Now, select the questions that players will answer! You’ll see a list of all available questions—simply click the ones you want to include. This is your chance to curate an engaging experience and make sure each question fits the theme of your quiz!</label>
                <Divider />
              </div>

              <Form.Item>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between'
              }}>
                {availableQuestions.map(question => (
                  <div
                    key={question._id}
                    style={{
                      marginBottom: '20px',
                      padding: '10px',
                      borderRadius: '4px',
                      border: '2px dashed #4caf50',
                      backgroundColor: selectedQuestions.includes(question._id) ? '#d3f9d8' : 'transparent', // Change background when selected
                      cursor: 'pointer',
                      flex: '0 0 calc(33.33% - 10px)',
                      boxSizing: 'border-box'
                    }}
                    onClick={() => handleQuestionSelection(question._id)}
                  >
                    <h4 style={{ textAlign: "center" }}>{question.question}</h4>
                    {question.imageUrl && (
                      <img
                        src={question.imageUrl}
                        alt={question.question}
                        style={{
                          display: 'block',
                          margin: '0 auto',
                          maxWidth: '100px',
                          maxHeight: '100px'
                        }}
                      />
                    )}
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                      {question.options.map((option, index) => (
                        <li key={index}>{option} {/* Display each option as a bullet point */}</li>
                      ))}
                    </ul>
                    <p>Correct Answer: {question.correctAnswer}</p> {/* Display correct answer */}
                    <Checkbox checked={selectedQuestions.includes(question._id)} style={{ display: 'none' }} /> {/* Hidden checkbox */}
                  </div>
                ))}
              </div>
              <BackTop/>
            </Form.Item>
            </>
          )}

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
            {currentStep > 0 && (
              <Button type="default" onClick={prevStep}>
                Previous
              </Button>
            )}
            {currentStep < 3 ? (
              <Button type="primary" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button type="primary" onClick={handleSubmit}>
                {buttonText}
              </Button>
            )}
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default QuizForm;
