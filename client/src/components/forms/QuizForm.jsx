import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, FormControl, RadioGroup, Radio, FormControlLabel, FormLabel, Checkbox, FormGroup } from '@mui/material';

const QuizForm = ({ open, handleClose, handleCreate }) => {
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [questions, setQuestions] = useState([]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { type: 'unique', text: '', options: [{ text: '', correct: false }] }]);
  };

  const handleQuestionTypeChange = (index, type) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].type = type;
    setQuestions(updatedQuestions);
  };

  const handleQuestionTextChange = (index, text) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].text = text;
    setQuestions(updatedQuestions);
  };

  const handleAddOption = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].options.push({ text: '', correct: false });
    setQuestions(updatedQuestions);
  };

  const handleRemoveOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(updatedQuestions);
  };

  const handleOptionTextChange = (questionIndex, optionIndex, text) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex].text = text;
    setQuestions(updatedQuestions);
  };

  const handleOptionCorrectChange = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex].correct = !updatedQuestions[questionIndex].options[optionIndex].correct;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = () => {
    const quizData = {
      title: quizTitle,
      description: quizDescription,
      questions,
    };
    handleCreate(quizData);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Créer un quiz</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Titre du quiz"
          fullWidth
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Description du quiz"
          fullWidth
          value={quizDescription}
          onChange={(e) => setQuizDescription(e.target.value)}
        />
        {questions.map((question, index) => (
          <div key={index}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Question {index + 1}</FormLabel>
              <RadioGroup
                aria-label="question-type"
                name="question-type"
                value={question.type}
                onChange={(e) => handleQuestionTypeChange(index, e.target.value)}
              >
                <FormControlLabel value="unique" control={<Radio />} label="Unique" />
                <FormControlLabel value="multiple" control={<Radio />} label="Multiple" />
              </RadioGroup>
            </FormControl>
            <TextField
              margin="dense"
              label="Votre question"
              fullWidth
              value={question.text}
              onChange={(e) => handleQuestionTextChange(index, e.target.value)}
            />
            <FormGroup>
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex}>
                  <FormControlLabel
                    control={<Checkbox checked={option.correct} onChange={() => handleOptionCorrectChange(index, optionIndex)} />}
                    label={
                      <TextField
                        margin="dense"
                        label={`Option ${optionIndex + 1}`}
                        fullWidth
                        value={option.text}
                        onChange={(e) => handleOptionTextChange(index, optionIndex, e.target.value)}
                      />
                    }
                  />
                  <Button onClick={() => handleRemoveOption(index, optionIndex)}>Supprimer</Button>
                </div>
              ))}
              <Button onClick={() => handleAddOption(index)}>Ajouter une option</Button>
            </FormGroup>
          </div>
        ))}
        <Button onClick={handleAddQuestion} color="primary">Ajouter une question</Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Annuler</Button>
        <Button onClick={handleSubmit} color="primary">Créer</Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuizForm;