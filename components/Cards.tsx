import React from "react";
import Card_1 from "./Cards/Card_1";
import Card_2 from "./Cards/Card_2";
import Card_3 from "./Cards/Card_3";
import Card_4 from "./Cards/Card_4";
import Card_5 from "./Cards/Card_5";
import Card_6 from "./Cards/Card_6";


{/*Split cards and put it in this component*/}
const Cards = () => {
  return (
    <div>
      <div className=" grid grid-cols-1 gap-3 md:gap-6 xs:grid-cols-2 lg:grid-cols-4">
        <Card_1/>
        <Card_2/>
        <Card_3/>
        <Card_4/>
        <Card_5/>
        <Card_6/>
      </div>
    </div>
  );
};

export default Cards;
