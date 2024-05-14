import logoImg from '../../assets/logo.svg'
import { Container } from '../../components/Container'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '../../components/Input/Input'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { auth } from '../../services/firebaseConnection'
import { createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth'
import { useEffect } from 'react'

import { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'

import toast from 'react-hot-toast'

const schema = z.object({
  name: z.string().min(1, "O campo nome é obrigatório"),
  email: z.string().email("Insira um email válido").min(1, "O campo email é obrigatório"),
  password: z.string().min(1, "O campo senha é obrigatório").min(6, "A senha deve ter pelo menos 6 caracteres")
})

type FormData = z.infer<typeof schema>

export function Register() {
  const { handleInfoUser } = useContext(AuthContext)
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  })

  useEffect(() => {
    async function handleLogout() {
      await signOut(auth)
    }

    handleLogout()
  }, [])

  async function onSubmit(data: FormData) {
    createUserWithEmailAndPassword(auth, data.email, data.password)
    .then(async (user) => {
      await updateProfile(user.user, {
        displayName: data.name
      })

      handleInfoUser({
        name: data.name,
        email: data.email,
        uid: user.user.uid
      })

      toast.success("Usuário cadastrado com sucesso! Bem-vindo ao WebCarros!")
      navigate("/dashboard", {replace: true})
    })
    .catch((error) => {
      toast.error("Erro ao cadastrar o usuário. Tente novamente.")
      console.log(error)
    })
  }


  return(
  <Container>
    <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
      <Link to="/" className='mb-6 max-w-sm w-full'>
        <img 
          className='w-full'
          src={logoImg} 
          alt="Logo do site" />
      </Link>


      <form
        onSubmit={handleSubmit(onSubmit)}
        className='bg-white max-w-xl w-full rounded-lg p-4'
      >
        <div className='mb-3'>
          <Input
            type="text"
            name="name"
            placeholder="Digite seu nome completo..."
            error={errors.name?.message}
            register={register}
          />

        </div>
        <div className='mb-3'>
          <Input
            type="email"
            name="email"
            placeholder="Digite seu email..."
            error={errors.email?.message}
            register={register}
          />

        </div>
        <div className='mb-3'>
          <Input
            type="password"
            name="password"
            placeholder="Digite sua senha..."
            error={errors.password?.message}
            register={register}
          />
        </div>

        <button 
          type="submit"
          className='bg-zinc-900 w-full rounded-md text-white h-10 font-medium'>
          Cadastrar
        </button>
      </form>

      <Link to="/login">
        Já possui uma conta? Faça o login!
      </Link>
    </div>


  </Container>
  )
 }

 