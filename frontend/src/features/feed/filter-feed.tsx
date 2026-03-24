import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { useState } from "react";

type FilterFeedProps = {
  filterTags: string[];
  setFilterTags: React.Dispatch<React.SetStateAction<string[]>>;
};

const FilterFeed = ({ filterTags, setFilterTags }: FilterFeedProps) => {
  const [inputTag, setInputTag] = useState<string>("");

  const handleAddTag = () => {
    if (inputTag.trim() === "") return;

    setFilterTags([...filterTags, inputTag.trim().toLowerCase()]);
    setInputTag("");
  };

  const handleRemoveTag = (idx: number) => {
    setFilterTags(filterTags.filter((tag) => tag !== filterTags[idx]));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="my-auto">Filter by tags</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-foreground text-white">
        <Label htmlFor="tags">Tags</Label>
        <div className="flex flex-row gap-2">
          <Input
            id="tags"
            value={inputTag}
            onChange={(e) => setInputTag(e.target.value)}
          />
          <Button onClick={handleAddTag}>Add</Button>
        </div>
        <div className="flex gap-1 cursor-pointer">
          {filterTags.map((tag, idx) => (
            <Badge key={idx} onClick={() => handleRemoveTag(idx)}>
              {tag}
            </Badge>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterFeed;
