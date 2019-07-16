const { BaseAgent, SimpleController, quickChats, Manager } = require('rlbot-test');
const { GameState, BallState, CarState, Physics, Vector3 } = require('rlbot-test').GameStateUtil

class ATBA extends BaseAgent {
    constructor(name, team, index, fieldInfo) {
        super(name, team, index, fieldInfo) //pushes these all to `this`.
    }
    getOutput(gameTickPacket, ballPrediction) {
        var controller = new SimpleController()
        /* ATBA example */
        if (!gameTickPacket.gameInfo.isRoundActive) {

            return controller;
        }
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
        
        this.renderer.beginRendering()
        this.renderer.drawString2D(20, 20, 3, 3, 'Hello world', new this.renderer.Color(255, 255, 0, 0))
        
        let black = new this.renderer.Color(255, 0, 0, 0)
        for(let i = 0; i < ballPrediction.slices.length-1; i++) {
            let ball1 = ballPrediction.slices[i].physics.location
            let ball2 = ballPrediction.slices[i+1].physics.location
            this.renderer.drawLine3D(new Vector3(ball1.x, ball1.y, ball1.z), new Vector3(ball2.x, ball2.y, ball2.z), black)
        }
        
        this.renderer.endRendering()

        //almost scored
        if(ballPrediction.slices[10].physics.location.y > 5120 || ballPrediction.slices[10].physics.location.y < -5120) {
            this.sendQuickChat(quickChats.compliments.NiceShot, false)
            let location = null
            let rotation = null
            let velocity = new Vector3(null, -gameTickPacket.ball.physics.velocity.y, null)
            let physics = new Physics(location, rotation, velocity)
            let ball = new BallState(physics)
            this.setGameState(new GameState(ball))
        }
        //cancel gravity
        // let cars = []
        // for(let car of gameTickPacket.players) {
        //     cars.push(new CarState(new Physics(null, null, new Vector3(null, null, car.physics.velocity.z+(650/55)))))
        // }
        // let ball = new BallState(new Physics(null, null, new Vector3(null, null, gameTickPacket.ball.physics.velocity.z+(650/55))))
        // this.setGameState(new GameState(ball, cars))
        controller.throttle = 1;
        return controller;

    }
}

const manager = new Manager(ATBA);
manager.start();