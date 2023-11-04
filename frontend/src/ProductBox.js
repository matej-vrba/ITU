import React, { useState } from "react";

const ProductBox = ({ item }) => {

    //const [valUrlImg, setImage] = useState("Placehoder")
    const placeholder = "/src/placeholder.svg";

    return (
        <>
            {item.map((product,index) => {
                return (
                    <div key={index}>
                        <div className="prod">
                            <img
                                src={placeholder}
                                className=""
                                loading="lazy"
                                width="384"
                                height="420"
                            />

                        </div>
                    <div className="desc">
                        <a className="openDetail"
                            //onClick=[() => handleProductItem(index)]}
                        >
                            {item}
                        </a>
                        <span className="price">0 Kc</span>
                        <span className="address">Adresa</span>
                    </div>
                    </div>
                
                );

            })}
        </>
    )
};
export default ProductBox;