import React from "react";
import Image from "next/image";

export default function Home({ name }: { name: string }) {
  return (
    <div>
      <div>hello</div>
      <div>{name}</div>
    </div>
  );
}
