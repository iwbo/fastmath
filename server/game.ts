import { DTM } from "../shared/dtm";
import * as events from "events";
export module Game {
    export var currentRoundID = 0;
    var rounds: DTM.IRound[] = [];
    export var emitter = new events.EventEmitter();
    // var number1 = 0;
    // var number2 = 0
    // var operator = "";
    // var correctAwnser = 0;
    // var potentialAwnser = 0;
    var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    var operators = [
        { name: "+", func: function (a: number, b: number) { return a + b; } },
        { name: "-", func: function (a: number, b: number) { return a - b; } },
        { name: "/", func: function (a: number, b: number) { return a / b; } },
        { name: "*", func: function (a: number, b: number) { return a * b; } }
    ];

    var totalRoundTime = 20;
    var roundTime = totalRoundTime;
    var roundInterval: NodeJS.Timer;
    export function startNewRound(): DTM.IEquation {
        currentRoundID++;
        stopRound();
        var equation = getRandomEquation(currentRoundID);

        var correctAwnser = equation.awnser;
        if (Math.random() >= 0.5) // ~50% to override the correct awnser
        {
            var equation2 = getRandomEquation(0);
            equation.awnser = equation2.awnser;
        }


        var round: DTM.IRound = {
            id: currentRoundID,
            equation: equation,
            correctAwnser: correctAwnser,
            hasWinner: false
        }
        rounds.push(round);
      
        roundInterval = setInterval(()=>{
            emitter.emit("nextRoundTime", roundTime--);
        }, 1000 * 1);
        return equation;
    }
    export function stopRound(){
        clearInterval(roundInterval);
        roundTime = totalRoundTime;
    }
    export function getLastEquation(): DTM.IEquation {
        if (rounds.length > 0) {
            return rounds[rounds.length - 1].equation;
        } else {
            return startNewRound();
        }
    }

    export function getPoint(answer: DTM.IAnswer): number {
        var lastRound = rounds[rounds.length - 1];
        var point = 0;
        if (lastRound) {
            if (!lastRound.hasWinner && lastRound.id === answer.roundID) {
                if ((lastRound.correctAwnser === lastRound.equation.awnser && answer.yes)
                    || (lastRound.correctAwnser !== lastRound.equation.awnser && !answer.yes)) {
                    point = 1; // The first player to submit a correct answer gets 1 point for the round  
                    lastRound.hasWinner = true; // and completes the round.
                } else {
                    point = -1; // All incorrect answers subtract a point from the players' score. 
                }
            } else { // late answers
                var matchRound: DTM.IRound = null;
                rounds.forEach((round, i) => {
                    if (!matchRound && round.id) {
                        matchRound = round;
                    }
                });
                if (matchRound) {
                    if ((matchRound.correctAwnser === matchRound.equation.awnser && answer.yes)
                        || (matchRound.correctAwnser !== matchRound.equation.awnser && !answer.yes)) {
                        point = 0; // Correct late answers do not affect the score
                    } else {
                        point = -1; // All incorrect answers subtract a point from the players' score. 
                    }
                }

            }
        }
        return point;
    }

    function getRandomEquation(roundID: number): DTM.IEquation {
        var _number1 = numbers[Math.floor(Math.random() * numbers.length)];
        var _number2 = numbers[Math.floor(Math.random() * numbers.length)];
        var operator = operators[Math.floor(Math.random() * operators.length)];
        var _operatorName = operator.name;
        var _correctAwnser = operator.func(_number1, _number2);
        return {
            number1: _number1,
            number2: _number2,
            operator: _operatorName,
            awnser: _correctAwnser,
            roundID: roundID,
            awnsered: false, // used on the client side
        }
    }

}


