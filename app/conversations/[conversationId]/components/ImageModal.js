"use client";

import Model from "@/app/components/Model";
import Image from "next/image";

const ImageModal = ({ isOpen, onClose, src }) => {
  if (!src) {
    null;
  }
  return (
    <Model isOpen={isOpen} onClose={onClose}>
      <div className="w-80 h-80">
        <Image alt="Image" className="object-cover" fill src={src} />
      </div>
    </Model>
  );
};

export default ImageModal;
