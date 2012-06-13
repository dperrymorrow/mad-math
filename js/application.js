(function() {

  window.dpm || (window.dpm = {});

  dpm.MadMath = (function() {

    MadMath.prototype.operators = ['-', '+'];

    MadMath.prototype.limit = 5;

    MadMath.prototype.level = 1;

    MadMath.prototype.currentQuestion = null;

    MadMath.prototype.currentProblem = null;

    MadMath.prototype.showNegative = false;

    MadMath.prototype.correctDelay = 1000;

    MadMath.prototype.wrongDelay = 4000;

    MadMath.prototype.score = 0;

    MadMath.prototype.startTime = 0;

    MadMath.prototype.successMsg = ['Sweet!', 'Nice!', 'Yes!', 'Awsome!', 'Yes Oliver!'];

    function MadMath() {
      var _this = this;
      this.template = $('#question-template').html();
      $(document).keyup(function(e) {
        if (e.which === 13) return _this.checkAnswer();
      });
      this.showQuestion();
      $('#easier,#harder').click(function(e) {
        return _this.changeLevel($(e.target).data('incriment'));
      });
    }

    MadMath.prototype.changeLevel = function(direction) {
      if (direction === -1) {
        this.level--;
      } else {
        this.level++;
      }
      if (this.level <= 0) this.level = 1;
      $('#level').text("Level: " + this.level);
      return this.showQuestion();
    };

    MadMath.prototype.checkAnswer = function() {
      var answer, attempt, delay;
      attempt = parseInt(this.currentQuestion.find('input').val());
      answer = this.getAnswer();
      if (attempt === answer) {
        this.currentQuestion.html(this.successMsg[Math.floor(Math.random() * this.successMsg.length)]).addClass('correct');
        delay = this.correctDelay;
        this.incrimentScore();
      } else {
        this.currentQuestion.addClass('wrong');
        this.currentQuestion.find('input').val(answer.toString());
        delay = this.wrongDelay;
      }
      setTimeout($.proxy(this, 'showQuestion'), delay);
      return this.currentQuestion.delay(delay - this.anSpeed).animate({
        'top': 'top',
        '100%': '100%'
      }, this.anSpeed);
    };

    MadMath.prototype.incrimentScore = function() {
      this.score += Math.round((this.level * 10) / (this.getStamp() - this.startTime));
      return $('#score-marker').text("Score: " + this.score);
    };

    MadMath.prototype.getAnswer = function() {
      return eval("" + this.currentProblem.first + this.currentProblem.operator + this.currentProblem.second);
    };

    MadMath.prototype.showQuestion = function() {
      this.currentQuestion = $(_.template(this.template, this.buildProblem()));
      $('#application').html(this.currentQuestion);
      this.currentQuestion.animate({
        top: '50%'
      }, this.anSpeed);
      this.currentQuestion.find('input').focus();
      return this.startTime = this.getStamp();
    };

    MadMath.prototype.getStamp = function() {
      return Math.round(new Date().getTime() / 1000);
    };

    MadMath.prototype.buildProblem = function() {
      this.currentProblem = {
        operator: this.operators[Math.floor(Math.random() * this.operators.length)],
        first: Math.floor((Math.random() * (this.limit * this.level)) + 1),
        second: Math.floor((Math.random() * (this.limit * this.level)) + 1)
      };
      if (this.getAnswer() < 0 && this.showNegative === false) {
        this.currentProblem.operator = "+";
      }
      return this.currentProblem;
    };

    return MadMath;

  })();

}).call(this);
