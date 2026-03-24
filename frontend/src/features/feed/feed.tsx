import {
  ItemGroup,
  Item,
  ItemHeader,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from "../../components/ui/item";
import { Badge } from "../../components/ui/badge";
import { API_URL } from "../../lib/config";
import FilterFeed from "./filter-feed";
import useFeed from "../../hooks/use-feed";
import { useEffect, useState } from "react";
import UploadImage from "../upload/upload-image";
import useWs from "../../hooks/use-ws";

const Feed = () => {
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const { images, error, refetchFeed } = useFeed(filterTags);
  const { newImageTrigger } = useWs();

  useEffect(() => {
    refetchFeed();
  }, [newImageTrigger]);

  return (
    <div className="flex flex-col max-w-xl w-full mx-auto mb-10">
      <div className="flex flex-row justify-between">
        <p className="text-3xl tracking-tighter text-background py-2">Feed</p>
        <div className="my-auto">
          <FilterFeed filterTags={filterTags} setFilterTags={setFilterTags} />
          <UploadImage />
        </div>
      </div>
      <ItemGroup>
        {error ? (
          <>
            <p className="text-red-500">{error}</p>
          </>
        ) : (
          <>
            {images
              ?.slice()
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime(),
              )
              .map((image) => (
                <Item key={image.id} variant="outline">
                  <ItemHeader>
                    <img className="object-cover" src={API_URL + image.url} />
                  </ItemHeader>
                  <ItemContent>
                    <ItemTitle>{image.title}</ItemTitle>
                    <ItemDescription className="flex gap-1">
                      {image.tags.map((tag, idx) => (
                        <Badge key={idx}>{tag}</Badge>
                      ))}
                    </ItemDescription>
                  </ItemContent>
                </Item>
              ))}
          </>
        )}
      </ItemGroup>
    </div>
  );
};

export default Feed;
