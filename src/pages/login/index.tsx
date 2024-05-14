import logoImg from '../../assets/logo.svg'
import { Container } from '../../components/Container'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '../../components/Input/Input'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { auth } from '../../services/firebaseConnection'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { useEffect } from 'react'
import toast from 'react-hot-toast'


const schema = z.object({
  email: z.string().email("Insira um email válido").min(1, "O campo email é obrigatório"),
  password: z.string().min(1, "O campo senha é obrigatório")
})

type FormData = z.infer<typeof schema>

export function Login() {
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

  function onSubmit(data: FormData) {
    signInWithEmailAndPassword(auth, data.email, data.password)
    .then((user) => {
      toast.success("Logado com sucesso!")
      navigate("/dashboard", {replace:true})
    })
    .catch((error) => {
      toast.error("Email ou senha inválidos. Tente novamente!")
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
          Acessar
        </button>
      </form>

      <Link to="/register">
        Ainda não possui uma conta? Cadastra-se
      </Link>
    </div>


  </Container>
  )
 }

 