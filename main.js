const rlbot = require('rlbot-test')

class ATBA extends rlbot.BaseAgent {
    getOutput(gameTickPacket, ballPrediction, fieldInfo) {
        var controller = rlbot.SimpleController
        /* ATBA example */
        if (!gameTickPacket.gameInfo.isRoundActive) {

            return controller;
        }
        console.log(ballPrediction, fieldInfo)
        var ballLocation = gameTickPacket.ball.physics.location;
        var carLocation = gameTickPacket.players[this.index].physics.location;
        var carRotation = gameTickPacket.players[this.index].physics.rotation;

        // Calculate to get the angle from the front of the bot's car to the ball.
        var botToTargetAngle = Math.atan2(ballLocation.y - carLocation.y, ballLocation.x - carLocation.x);
        var botFrontToTargetAngle = botToTargetAngle - carRotation.yaw;

        // Correct the angle
        if (botFrontToTargetAngle < -Math.PI) { botFrontToTargetAngle += 2 * Math.PI };
        if (botFrontToTargetAngle > Math.PI) { botFrontToTargetAngle -= 2 * Math.PI };

        // Decide which way to steer in order to get to the ball.
        if (botFrontToTargetAngle > 0) {
            controller.steer = 1;
        } else {
            controller.steer = -1;
        }

        controller.throttle = 1;
        return controller;

    }
}

const manager = new rlbot.Manager(ATBA);
manager.start();