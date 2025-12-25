import  userManager  from "../auth/user-service"; // Предполагается, что вы экспортируете инстанс userManager из user-service.ts

export class ClientBase {
    protected async transformOptions(options: RequestInit): Promise<RequestInit> {
        // Получаем пользователя из userManager
        const user = await userManager.getUser();
        
        // Проверяем, что пользователь существует и его токен не истек
        if (user && !user.expired) {
            options.headers = {
                ...options.headers,
                // Добавляем заголовок авторизации
                Authorization: 'Bearer ' + user.access_token,
            };
        }
        return Promise.resolve(options);
    }
}