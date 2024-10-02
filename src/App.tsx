import { useEffect, useState, useRef, FormEvent } from 'react'
import { FiTrash } from 'react-icons/fi'
import { api } from './services/api'

interface ProductsProps{
  id: string,
  name: string,
  category: string,
  amount: string,
  status: boolean
}

export default function App() {

  const [products, setProducts] = useState<ProductsProps[]>([])
  const nameRef = useRef<HTMLInputElement | null>(null)
  const categoryRef = useRef<HTMLInputElement | null>(null)
  const amountRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts(){
    const response = await api.get("/products")
    setProducts(response.data)
  }

  async function handleSubmit(e: FormEvent){
    e.preventDefault()

    if(!nameRef.current?.value || !categoryRef.current?.value || !amountRef.current?.value) return

    const response = await api.post("/products", {
      name: nameRef.current?.value,
      category: categoryRef.current?.value,
      amount: amountRef.current?.value
    })

    setProducts(allProducts => [... allProducts, response.data])

    nameRef.current.value = ""
    categoryRef.current.value = ""
    amountRef.current.value = ""
  }

  async function handleDelete(id: string) {
      try {
      await api.delete("/products", {
        params: {
          id: id,
        }
      })

      const allProducts = products.filter( (products) => products.id !== id)
      setProducts(allProducts)

    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="w-full min-h-screen bg-gray-900 flex justify-center px-4">
      <main className="my-10 w-full md: max-w-2xl ">
        <h1 className="flex items-center justify-center text-4xl font-medium text-white">Produtos</h1>

        <form className="flex flex-col my-6" onSubmit={handleSubmit}>
          <label className="font-medium text-white">Nome do Produto: </label>
          <input 
              type="text" 
              placeholder="Digite o nome do produto" 
              className="w-full mb-5 p-2 rounded"
              ref={nameRef}
              />
          <label className="font-medium text-white">Categoria do Produto: </label>
          <input 
              type="text" 
              placeholder="Digite a categoria do produto" 
              className="w-full mb-5 p-2 rounded"
              ref={categoryRef}
              /> 
          <label className="font-medium text-white">Preço do Produto: </label>
          <input 
              type="text" 
              placeholder="Digite o Preço do produto" 
              className="w-full mb-5 p-2 rounded"
              ref={amountRef}
              />   

          <input 
              type="submit" 
              value="Salvar" 
              className="cursor-pointer w-full p-2 bg-green-800 rounded text-white font-medium"
              />
        </form>

          <section className="flex flex-col gap-3">
            {products.map((product) => (
              <article
              key={product.id} 
              className="w-full bg-white p-2 rounded relative hover:scale-110 duration-200"
              >
              <p><span className="font-medium">Produto :</span> {product.name}</p>
              <p><span className="font-medium">Categoria :</span> {product.category}</p>
              <p><span className="font-medium">Preço :</span> {product.amount}</p>
              <p><span className="font-medium">Status :</span> {product.status ? "Em Estoque" : "Sem Estoque"}</p>
              <button 
                onClick={ () => handleDelete(product.id)}
                className='flex items-center justify-center bg-red-700 w-7 h-7 rounded-md absolute right-0 -top-3'>
                <FiTrash size={18} color='#fff'/>
              </button>
            </article>
            ))}
          </section>
      </main>
    </div>
  )
}