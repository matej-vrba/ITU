import './ProductBox.css';
import React, { useState } from "react";

const ProductBox = ({ item }) => {


    return (
        <>
            {item.map((value) => {

            return (
                <div className="prod openDetail">
                    <img className="prod-img" src="https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png"/>
                    <div className="prod-text">ProductName</div>
                    <div className="prod-text ">Price</div>
                    <div className="prod-text">
                        <p>Adresa</p>
                    </div>
                </div>
            );
        })}

        </>
    )
};
export default ProductBox;