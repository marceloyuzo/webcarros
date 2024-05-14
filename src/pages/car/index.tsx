import { Container } from "../../components/Container"
import { FaWhatsapp } from "react-icons/fa"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { db } from "../../services/firebaseConnection"
import { getDoc, doc } from "firebase/firestore"
import { Swiper, SwiperSlide } from "swiper/react"


interface CarProps {
  id: string,
  name: string,
  model: string,
  city: string,
  year: string,
  km: string,
  description: string,
  created: string,
  price: string,
  owner: string,
  uid: string,
  whatsapp: string,
  images: ImagesCarProps[]
}

interface ImagesCarProps {
  uid: string,
  name: string,
  url: string,
}

export function CarDetail() {
  const [car, setCar] = useState<CarProps>()
  const { id } = useParams()
  const [sliderPewView, setSliderPerView] = useState<number>(2)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadCar() {
      if(!id) { return }

      const docRef = doc(db, "cars", id)
      getDoc(docRef)
      .then((snapshot) => {
        if(!snapshot.data()) {
          navigate("/")
        }

        setCar({
          id: snapshot.id,
          name: snapshot.data()?.name,
          model: snapshot.data()?.model,
          city: snapshot.data()?.city,
          year: snapshot.data()?.year,
          km: snapshot.data()?.km,
          description: snapshot.data()?.description,
          created: snapshot.data()?.created,
          price: snapshot.data()?.price,
          owner: snapshot.data()?.owner,
          uid: snapshot.data()?.uid,
          whatsapp: snapshot.data()?.whatsapp,
          images: snapshot.data()?.images
        })
      })
      .catch((error) => {
        console.log(error)
      })
    }

    loadCar()
  }, [id])

  useEffect(() => {
    function handleResize() {
      if(window.innerWidth < 720) {
        setSliderPerView(1)
      } else {
        setSliderPerView(2)
      }
    }

    handleResize()

    window.addEventListener("resize", handleResize)

    return() => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return(
    <Container>
      { car && (
        <Swiper
          slidesPerView={sliderPewView}
          pagination={{ clickable: true }}
          navigation
        >
          {car?.images.map( image => (
            <SwiperSlide key={image.name}>
              <img 
                className="w-full h-96 object-cover"
                src={image.url} 
                alt={image.name}
              />
            </SwiperSlide>
          ))}

        </Swiper>
      )}

      {car && (
        <main className="w-full bg-white rounded-lg p-6 my-4">
          <div className="flex flex-col sm:flex-row mb-4 items-center justify-between">
            <h1 className="font-bold text-3xl text-black">{car?.name}</h1>
            <h1 className="font-bold text-3xl text-black">{Number(car?.price).toLocaleString("pt-BR", {style: "currency", currency: "BRL"})}</h1>
          </div>

          <p>{car?.model}</p>

          <div className="flex w-full gap-20 my-8">
              <div>
                <p>Cidade</p>
                <strong>{car?.city}</strong>
              </div>
              <div>
                <p>Ano</p>
                <strong>{car?.year}</strong>
              </div>
              <div>
                <p>Km</p>
                <strong>{car?.km}</strong>
              </div>
          </div>

          <strong>Descrição:</strong>
          <p className="mb-8">{car?.description}</p>

          <strong>Telefone / Whatsapp</strong>
          <p>{car?.whatsapp}</p>

          <a 
            className="bg-green-500 w-full text-white flex items-center justify-center gap-2 mt-8 h-11 text-xl rounded-lg font-medium cursor-pointer"
            href={`https://api.whatsapp.com/send?phone=${car?.whatsapp}&text=Olá vi esse ${car?.name} no site WebCarros e fiquei interessado.`}
            target="_blank"  
          >
            Conversar com vendedor
            <FaWhatsapp size={26} color="#fff"/>
          </a>
        </main>
      )}
    </Container>
  )
}

 