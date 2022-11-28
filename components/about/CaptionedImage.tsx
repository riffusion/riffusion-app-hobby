import Image from "next/image";

interface CaptionedImageProps {
  image_url: string;
  caption: string;
  marginLeft?: number;
}

export default function CaptionedImage({
  image_url,
  caption,
  marginLeft = 16,
}: CaptionedImageProps) {
  return (
    <div className={`m-5 ml-${marginLeft}`}>
      <p className="font-bold pb-2 text-base">{caption}</p>
      <Image
        src={image_url}
        width={300}
        height={300}
        alt={caption}
      />
    </div>
  );
}
