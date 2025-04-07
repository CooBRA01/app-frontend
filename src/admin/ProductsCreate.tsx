import React, { SyntheticEvent } from "react";
import Wrapper from "./Wrapper"; 
import { useState } from "react";
//test

const ProductCreate = () => {

    const [title, setTitle] = useState('');
    const [image, setImage] = useState('');

    const submit = async (e: SyntheticEvent ) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('image', image);

        await fetch('http://localhost:8000/api/products', {
            method: 'POST',
           headers: {'content-type': 'application/json'},
            body: JSON.stringify({
                title: title,
                image: image
            })
        });
    };


    return (
       <Wrapper>
              <form  onSubmit={submit}>
                <div className="mb-3">
                     <label>Title</label>
                     <input type="text" className="form-control"
                        onChange={(e) => setTitle(e.target.value)}
                     />
                </div>
                
                <div className="mb-3">
                     <label>Image</label>
                     <input type="file" className="form-control"
                        onChange={(e) => setImage(e.target.value)}
                     />
                </div>
               
                <button className="btn btn-outline-secondary">Save</button>
              </form>
         </Wrapper>
    )
}

export default ProductCreate;