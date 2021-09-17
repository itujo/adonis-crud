import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import CreateUserValidator from 'App/Validators/CreateUserValidator'

export default class UsersController {
  public async index({ auth }: HttpContextContract) {
    await auth.use('web').authenticate()

    const users = await User.all()
    return users
  }

  public async me({ auth }: HttpContextContract) {
    await auth.use('web').authenticate()

    const id = auth.user?.id

    const user = await User.findOrFail(id)
    return user
  }

  public async show({ auth, request }: HttpContextContract) {
    await auth.use('web').authenticate()

    const id = request.param('id')

    const user = await User.findOrFail(id)

    return user
  }

  public async store({ auth, request, response }: HttpContextContract) {
    await auth.use('web').authenticate()

    const newUser = await request.validate(CreateUserValidator)

    try {
      const user = await User.create(newUser)

      return response.created(user)
    } catch (error) {
      return response.badRequest(error)
    }
  }

  public async destroy({ auth, params, response }: HttpContextContract) {
    await auth.use('web').authenticate()

    const { id } = params
    const user = await User.findOrFail(id)
    await user.delete()

    return response.accepted({
      status: 'ok',
      message: `user with id ${id} deleted sucessfully`,
    })
  }

  public async login({ request, auth }: HttpContextContract) {
    const emailOrUsername = request.input('emailOrUsername')
    const password = request.input('password')

    await auth.use('web').attempt(emailOrUsername, password, true)
  }

  public async logout({ auth }: HttpContextContract) {
    await auth.use('web').logout()
  }
}
