import { useParams } from "react-router-dom"
export default function Persona() {
  const {id} = useParams()

  return (
    <div>
      <h1>Persona: {id}</h1>

    </div>
  )
}