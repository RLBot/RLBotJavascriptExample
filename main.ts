import { 
    BaseAgent, 
    SimpleController, 
    quickChats, 
    Manager, 
    GameState, 
    BallState, 
    CarState, 
    Physics, 
    Vector3,
    FieldInfo,
    Color,
    GameTickPacket,
    BallPrediction,
    Rotator
} from 'rlbot-test';

class ATBA extends BaseAgent {
    constructor(name: string, team: number, index: number, fieldInfo: FieldInfo) {
        super(name, team, index, fieldInfo) //pushes these all to `this`.
    }
    getOutput(gameTickPacket: GameTickPacket, ballPrediction: BallPrediction) {
        var controller = new SimpleController()
        /* ATBA example */
        if (!gameTickPacket.gameInfo.isRoundActive) {

            return controller;
        }

        var ballLocation: Vector3 = gameTickPacket.ball.physics.location;
        var carLocation: Vector3 = gameTickPacket.players[this.index].physics.location;
        var carRotation: Rotator = gameTickPacket.players[this.index].physics.rotation;
        
        //for spikerush
        controller.useItem = true

        // Calculate to get the angle from the front of the bot's car to the ball.
        var botToTargetAngle = Math.atan2(ballLocation.y - carLocation.y, ballLocation.x - carLocation.x);
        var botFrontToTargetAngle = botToTargetAngle - carRotation.yaw;

        // Correct the angle
        if (botFrontToTargetAngle < -Math.PI) botFrontToTargetAngle += 2 * Math.PI;
        if (botFrontToTargetAngle > Math.PI) botFrontToTargetAngle -= 2 * Math.PI;

        // Decide which way to steer in order to get to the ball.
        if (botFrontToTargetAngle > 0) {
            controller.steer = 1;
        } else {
            controller.steer = -1;
        }
        
        //renders "Hello world"
        this.renderer.beginRendering()
        this.renderer.drawString2D(20, 20, 3, 3, 'Hello world', new Color(255, 255, 0, 0))
        
        //renderes the ball prediction
        //the color for rendering
        let black = new Color(255, 0, 0, 0)
        for(let i = 0; i < ballPrediction.slices.length-1; i++) {
            let ball1 = ballPrediction.slices[i].physics.location
            let ball2 = ballPrediction.slices[i+1].physics.location
            this.renderer.drawLine3D(new Vector3(ball1.x, ball1.y, ball1.z), new Vector3(ball2.x, ball2.y, ball2.z), black)
        }
        
        this.renderer.endRendering()

        //almost scored (checks 10 frames into the future)
        if(Math.abs(ballPrediction.slices[10].physics.location.y) > 5120) {

            //send a quickchat
            this.sendQuickChat(quickChats.compliments.NiceShot, false)

            //reverse the y so it can't score (YOU PROBABLY WANNA REMOVE THIS)
            let location = null
            let rotation = null
            let velocity = new Vector3(null, gameTickPacket.ball.physics.velocity.y*-1, null)
            let physics = new Physics(location, rotation, velocity)
            let ball = new BallState(physics)
            this.setGameState(new GameState(ball))


        }


        controller.throttle = 1;
        return controller; //yes this returns before the gravity get canceled, so move the return if you want to have 0 gravity

        //cancel gravity
        //PROBABLY WANNA REMOVE THIS
        let cars = []
        for(let car of gameTickPacket.players) {
            cars.push(new CarState(new Physics(null, null, new Vector3(null, null, car.physics.velocity.z+(650/60))))) //assumes you are running 60fps
        }
        let ball = new BallState(new Physics(null, null, new Vector3(null, null, gameTickPacket.ball.physics.velocity.z+(650/60)))) //assumes you are running 60fps
        this.setGameState(new GameState(ball, cars))



        

    }
}

const manager = new Manager(ATBA);
manager.start();
