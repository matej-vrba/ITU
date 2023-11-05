import './ProductBox.css';
import React, { useState } from "react";

const ProductBox = ({ item }) => {


    return (
        <>
            {item.map((value) => {

            return (
                <div className="prod openDetail">
                    <img className="prod-img" src="https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png"/>
                    <div className='prod-desc'>
                    <div className="prod-text">{value.title}</div>
                    <div className="prod-text ">{value.price}</div>
                    <div className="prod-text">
                        <p>{value.street}</p>
                    </div>
                    </div>
                </div>
            );
        })}

        </>
    )
};
export default ProductBox;