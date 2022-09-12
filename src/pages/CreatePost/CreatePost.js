import styles from "./CreatePost.module.css"

import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useAuthValue} from '../../context/AuthContext'
import {useInsertDocument} from "../../hooks/useInsertDocument"

const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");
    const [body, setBody] = useState("");
    const [tags, setTags] = useState([]);
    const [errorForm, setErrorForm] = useState("");
    const {user} = useAuthValue();
    const {insertDocument, response} = useInsertDocument("posts");
    const navigate = useNavigate()

    const handleSubmit = (e) => {
      e.preventDefault();

      //validade image url
      try{
        new URL(image);
      } catch (error) {
        setErrorForm("A imagem precisa ser uma url");
      }

      //criar o array de tag
      const tagsArray = tags.split(",").map((tag) => tag.trim().toLowerCase());

      //Checar todos os valores
      if(!title || !image || !body || !tags) {
        setErrorForm("Por favor, preencha todos os campos!");
      }

      if(errorForm) return;

      insertDocument({
        title,
        image,
        body,
        tagsArray,
        uid: user.uid,
        createdBy: user.displayName
      });

      //redirect to home page
      navigate("/")
    };

  return (
    <div className={styles.create_post}>
        <h2>Criar Post</h2>
        <p>Escreva sobre o que quiser e compartilhe o seu conhecimento</p>
        <form onSubmit={handleSubmit}>
          <label>
            <span>Título:</span>
            <input type="text" name="title" required placeholder="Pense num bom título" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label>
            <span>URL da imagem:</span>
            <input type="text" name="image" required placeholder="Insira uma image que representa o seu post" value={image} onChange={(e) => setImage(e.target.value)} />
          </label>
          <label>
            <span>Conteúdo:</span>
            <textarea name="body" required placeholder="Insira o conteúdo do post" value={body} onChange={(e) => setBody(e.target.value)}>Insira o conteúdo do post</textarea>
          </label>
          <label>
            <span>Tags:</span>
            <input type="text" name="tags" required placeholder="Insira as tags separadas por vírgula" value={tags} onChange={(e) => setTags(e.target.value)} />
          </label>
          {!response.loading && <button className="btn">Criar Post!</button>}
          {response.loading && <button className="btn" disabled>Aguarde...</button>}
          {response.error && <p className="error">{response.error}</p>}
          {errorForm && <p className="error">{errorForm}</p>}
        </form>
    </div>
  )
}

export default CreatePost