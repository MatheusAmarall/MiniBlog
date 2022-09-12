import styles from "./EditPost.module.css"

import {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {useAuthValue} from '../../context/AuthContext'
import {useUpdateDocument} from "../../hooks/useUpdateDocument"
import {useFetchDocument} from "../../hooks/useFetchDocument"

const EditPost = () => {
    const {id} = useParams();
    const {document: post} = useFetchDocument("posts", id)

    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");
    const [body, setBody] = useState("");
    const [tags, setTags] = useState([]);
    const [errorForm, setErrorForm] = useState("");
    const {user} = useAuthValue();
    const {updateDocument, response} = useUpdateDocument("posts");
    const navigate = useNavigate()

    useEffect(() => {
      if(post) {
        setTitle(post.title)
        setBody(post.body)
        setImage(post.image)
        const textTags = post.tagsArray.join(", ")
        setTags(textTags)
      }
    }, [post])

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

      const data = {
        title,
        image,
        body,
        tagsArray,
        uid: user.uid,
        createdBy: user.displayName
      }

      updateDocument(id, data);

      //redirect to home page
      navigate("/dashboard")
    };

  return (
    <div className={styles.edit_post}>
        {post && (
          <>
            <h2>Editando post: {post.title}</h2>
            <p>Altere os dados do post como desejar</p>
            <form onSubmit={handleSubmit}>
              <label>
                <span>Título:</span>
                <input type="text" name="title" required placeholder="Pense num bom título" value={title} onChange={(e) => setTitle(e.target.value)} />
              </label>
              <label>
                <span>URL da imagem:</span>
                <input type="text" name="image" required placeholder="Insira uma image que representa o seu post" value={image} onChange={(e) => setImage(e.target.value)} />
              </label>
              <p className={styles.preview_title}>Preview da imagem atual:</p>
              <img className={styles.image_preview} src={post.image} alt={post.title} />
              <label>
                <span>Conteúdo:</span>
                <textarea name="body" required placeholder="Insira o conteúdo do post" value={body} onChange={(e) => setBody(e.target.value)}>Insira o conteúdo do post</textarea>
              </label>
              <label>
                <span>Tags:</span>
                <input type="text" name="tags" required placeholder="Insira as tags separadas por vírgula" value={tags} onChange={(e) => setTags(e.target.value)} />
              </label>
              {!response.loading && <button className="btn">Editar</button>}
              {response.loading && <button className="btn" disabled>Aguarde...</button>}
              {response.error && <p className="error">{response.error}</p>}
              {errorForm && <p className="error">{errorForm}</p>}
            </form>
          </>
        )}
        
    </div>
  )
}

export default EditPost