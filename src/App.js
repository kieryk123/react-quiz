import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      data: '',
      question: '',
      answer: '',
      round: 1,
      points: 0
    };
    this.roundUp = this.roundUp.bind(this);
    this.addPoint = this.addPoint.bind(this);
    this.nextRound = this.nextRound.bind(this);
    this.checkRound = this.checkRound.bind(this);
  }

  componentWillMount() {
    this.getQuestions();
  }

  getQuestions(url = 'https://kieryk123.github.io/Quiz_app/questions.json') {
    fetch(url)
      .then((data) => data.json())
      .then((data) => {
        this.setState({
          data: data
        });
        this.checkRound();
      })
      .catch((error) => {
        console.log(error);
      })
  }

  checkRound() {
    let data = this.state.data;
    switch (this.state.round) {
      case 1:
        this.setState({
          question: data.questions[0].question,
          answer: data.questions[0].answer
        });
        break;
      case 2:
        this.setState({
          question: data.questions[1].question,
          answer: data.questions[1].answer
        });
        break;
      case 3:
        this.setState({
          question: data.questions[2].question,
          answer: data.questions[2].answer
        });
        break;
      case 4:
        this.setState({
          question: data.questions[3].question,
          answer: data.questions[3].answer
        });
        break;
      case 5:
        this.setState({
          question: data.questions[4].question,
          answer: data.questions[4].answer
        });
        break;
      default:
        this.setState({
          question: 'KONIEC GRY!',
          answer: 'KONIEC GRY!'
        });
        break;
    }
  }

  roundUp() {
    return new Promise((resolve) => {
      this.setState({
        round: this.state.round + 1
      }, resolve);
    })
  }

  addPoint() {
    return new Promise((resolve) => {
      this.setState({
        points: this.state.points + 1
      }, resolve);
    })
  }

  nextRound() {
    this.roundUp().then(this.addPoint).then(this.checkRound);
  }

  endGame() {
    this.setState({
      question: 'KONIEC GRY!',
      answer: 'KONIEC GRY!'
    });
  }

  render() {
    return (
      <div className="wrapper">
        <div className="quiz-window">
          <Question question={this.state.question} />
          <Timer key={this.state.round} round={this.state.round} onTimesUp={this.endGame.bind(this)} />
          <PointsCounter points={this.state.points} />
          <div className="buttons-wrapper">
            <Button
              name="A"
              handleClick={this.nextRound}
              answer={this.state.answer}
            />
            <Button
              name="B"
              handleClick={this.nextRound}
              answer={this.state.answer}
            />
            <Button
              name="C"
              handleClick={this.nextRound}
              answer={this.state.answer}
            />
            <Button
              name="D"
              handleClick={this.nextRound}
              answer={this.state.answer}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default App;

const Question = (props) => {
  return <h1 className="question">{props.question.split('<br>').map(l => <span>{l}<br /></span>)}</h1>;
}

class Button extends Component {
  checkAnswer() {
    if (this.props.name === this.props.answer) {
      this.props.handleClick();
    }
  }

  render() {
    return <button onClick={this.checkAnswer.bind(this)} className="answer-btn" type="button">{this.props.name}</button>;
  }
}

class Timer extends Component {
  constructor() {
    super();
    this.state = {
      time: 10
    }
  }

  componentWillMount() {
    if (this.props.round === 6) {
      clearInterval(this.timer);
      this.setState({time: 0});
    } else {
      this.setUpTimer();
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  setUpTimer() {
    clearInterval(this.timer);
    this.setState({time: 10}, () => {
      this.timer = setInterval(() => {
        this.setState((state) => {
          console.log('cykam');
          if (state.time === 1) {
            this.props.onTimesUp();
            clearInterval(this.timer);
          }
          return {time: state.time - 1};
        });
      }, 1000);
    });
  }

  render() {
    return (
      <h3>Pozostały czas: <span className="time">{this.state.time}</span></h3>
    )
  }
}

const PointsCounter = (props) => {
  return <h3>Twoje punkty: <span className="points">{props.points}</span></h3>
}
