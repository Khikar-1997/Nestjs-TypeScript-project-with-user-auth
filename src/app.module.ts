import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {LoggerMiddleware} from "./common/middleware/logger.middleware";
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UsersModule} from './users/users.module';
import {UsersController} from "./users/users.controller";

@Module({
    imports: [UsersModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggerMiddleware)
            .exclude(
                {path: 'users', method: RequestMethod.GET},
                {path: 'users', method: RequestMethod.POST},
                'users/.*',
            )
            .forRoutes(UsersController);
    }
}
