import { Container } from "../../components/Container"
import { useState, useEffect } from "react"
import { db } from "../../services/firebaseConnection"
import { collection, query, getDocs, orderBy, where } from "firebase/firestore"
import { Link } from "react-router-dom"

interface CarsProps {
  id: string,
  name: string,
  year: string,
  uid: string,
  price: string,
  city: string,
  km: string,
  images: CarImageProps[]
}

interface CarImageProps {
  name: string,
  uid: string,
  url: string
}

export function Home() {
  const [cars, setCars] = useState<CarsProps[]>([])
  const [loadImages, setLoadImages] = useState<string[]>([])
  const [input, setInput] = useState("")

  useEffect(() => {
    loadCars()
  }, [])

  useEffect(() => {
    handleSearchCar()
  }, [input])

  function loadCars() {
    const carsRef = collection(db, "cars")
    const queryRef = query(carsRef, orderBy("created", "desc"))

    getDocs(queryRef)
    .then((snapshot) => {
      let listcars = [] as CarsProps[]

      snapshot.forEach( doc => {
        listcars.push({
          id: doc.id,
          uid: doc.data().uid,
          name: doc.data().name,
          year: doc.data().year,
          km: doc.data().km,
          city: doc.data().city,
          price: doc.data().price,
          images: doc.data().images
        })
      })

      setCars(listcars)
    })
  }

  function handleImageLoad(id: string) {
     setLoadImages((prevImageLoaded) => [...prevImageLoaded, id])
  }

  async function handleSearchCar() {
    if(!input) {
      loadCars()
      return
    }

    setCars([])
    setLoadImages([])

    const q = query(collection(db, "cars"), 
      where("name", ">=", input.toUpperCase()), 
      where("name", "<=", input.toUpperCase() + "\uf8ff")
    )

    const querySnapshot = await getDocs(q)
    let listcars = [] as CarsProps[]

    querySnapshot.forEach((doc) =>{
      listcars.push({
        id: doc.id,
        uid: doc.data().uid,
        name: doc.data().name,
        year: doc.data().year,
        km: doc.data().km,
        city: doc.data().city,
        price: doc.data().price,
        images: doc.data().images
      })
    })

    setCars(listcars)
  }

   return(
    <Container>
      <section className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
        <input 
          className="w-full border-2 rounded-lg h-9 px-3 outline-none"
          type="text"
          placeholder="Digite o nome do carro..." 
          value={input}
          onChange={ (e) => setInput(e.target.value)}
        />
        <button 
          className="bg-red-500 h-9 px-8 rounded-lg font-medium text-white text-lg"
          onClick={handleSearchCar}
        >
          Buscar
        </button>
      </section>

      <h1 className="font-bold text-center mt-6 text-2xl mb-4">
        Carros novos e usados em todo o brasil
      </h1>

      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cars.map(car => (
          <Link key={car.id} to={`/car/${car.id}`}>
            <section className="w-full bg-white rounded-lg hover:scale-105 transition-all" >
              <div 
                className="w-full h-72 roundedlg bg-slate-200"
                style={{display: loadImages.includes(car.id) ? "none" : "block"}}
              >
                
              </div>
              <img 
                className="w-full rounded-lg mb-2 max-h-72 "
                src={car.images[0].url}
                alt={car.name}
                onLoad={() => handleImageLoad(car.id)}
                style={{display: loadImages.includes(car.id) ? "block" : "none"}}
              />
              <p className="font-bold mt-1 mb-2 px-2 text-xl">{car.name}</p>

              <div className="flex flex-col px-2">
                <span className="text-zinc-700 mb-6">Ano {car.year} | {car.km} km</span>
                <strong className="text-black font-medium text-xl">
                  {Number(car.price).toLocaleString("pt-br", { 
                    style: "currency",
                    currency: "BRL"})}
                </strong>
              </div>

              <div className="w-full h-px bg-slate-200 my-2"></div>

              <div className="px-2 pb-2">
                <span className="text-zinc-700">
                  {car.city}
                </span>
              </div>
            </section>
          </Link>
        ))}

        
      </main>
    </Container>

   )
 }

 