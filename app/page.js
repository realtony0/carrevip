import Site from "./site";
import config from "@/data/establishments.json";
import { getPhotos } from "@/lib/photos";

export default async function Page() {
  const establishments = await Promise.all(
    config.map(async (c) => ({ ...c, photos: await getPhotos(c.id) }))
  );
  return <Site establishments={establishments} />;
}
