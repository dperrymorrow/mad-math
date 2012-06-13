window.dpm ||= {}
class dpm.MadMath
  operators:       ['-','+']
  limit:           5
  level:           1
  currentQuestion: null
  currentProblem:  null
  showNegative:    false
  correctDelay:    1000
  wrongDelay:      4000
  score:           0
  startTime:       0
  successMsg:      ['Sweet!','Nice!','Yes!','Awsome!','Yes Oliver!']

  constructor:->
    @template = $('#question-template').html()
    $(document).keyup (e)=>
      @checkAnswer() if e.which is 13

    @showQuestion()

    $('#easier,#harder').click (e)=>
      @changeLevel $(e.target).data('incriment')

  changeLevel:(direction)->
    if direction is -1 then @level-- else @level++
    @level = 1 if @level <= 0

    $('#level').text("Level: #{@level}")
    @showQuestion()

  checkAnswer:()->
    attempt = parseInt @currentQuestion.find('input').val()
    answer = @getAnswer()

    if attempt is answer
      @currentQuestion.html( @successMsg[Math.floor(Math.random()*@successMsg.length)] ).addClass('correct')
      delay = @correctDelay
      @incrimentScore()
    else
      @currentQuestion.addClass('wrong')
      @currentQuestion.find('input').val answer.toString()
      delay = @wrongDelay

    setTimeout $.proxy( @, 'showQuestion' ), delay
    @currentQuestion.delay( delay - @anSpeed ).animate {'top', '100%'}, @anSpeed

  incrimentScore:->
    @score+= Math.round (@level*10)/(@getStamp() - @startTime)
    $('#score-marker').text "Score: #{@score}"

  getAnswer:->
    eval "#{@currentProblem.first}#{@currentProblem.operator}#{@currentProblem.second}"

  showQuestion:->
    @currentQuestion = $(_.template @template, @buildProblem())
    $('#application').html @currentQuestion
    @currentQuestion.animate {top:'50%'}, @anSpeed
    @currentQuestion.find('input').focus()
    @startTime = @getStamp()

  getStamp:->
    Math.round new Date().getTime() / 1000

  buildProblem:->
    @currentProblem =
      operator: @operators[Math.floor(Math.random()*@operators.length)]
      first: Math.floor (Math.random()*(@limit*@level))+1
      second: Math.floor (Math.random()*(@limit*@level))+1

    if @getAnswer() < 0 and @showNegative is false
      @currentProblem.operator = "+"

    @currentProblem




