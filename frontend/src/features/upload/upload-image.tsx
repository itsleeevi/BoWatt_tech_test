import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Field, FieldGroup, FieldDescription } from "../../components/ui/field";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { useState } from "react";
import useUploadImage from "../../hooks/use-upload-image";

const UploadImage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [tags, setTags] = useState<string[]>([]);
  const [inputTag, setInputTag] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [selectedImageName, setSelectedImageName] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { uploadImage, error } = useUploadImage();

  const handleAddTag = () => {
    if (inputTag.trim() === "") return;

    setTags([...tags, inputTag.trim().toLowerCase()]);
    setInputTag("");
  };

  const handleChooseFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const file = files[0];

    setSelectedFile(file);
    setSelectedImageName(file.name);
  };

  const handleRemoveTag = (idx: number) => {
    setTags(tags.filter((tag) => tag !== tags[idx]));
  };

  const handleCancel = () => {
    setTags([]);
    setInputTag("");
    setSelectedImageName("");
  };

  const handleUpload = async () => {
    if (selectedFile !== null)
      await uploadImage({ title, tags, file: selectedFile });

    handleCancel();
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <>
          <DialogTrigger asChild>
            <Button>Upload image</Button>
          </DialogTrigger>
          {error ? (
            <p className="text-white m-auto"></p>
          ) : (
            <>
              <DialogContent className="sm:max-w-sm bg-foreground">
                <DialogHeader>
                  <DialogTitle>Upload image</DialogTitle>
                </DialogHeader>
                <FieldGroup className="text-white">
                  <Field>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </Field>
                  <Field>
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
                      {tags.map((tag, idx) => (
                        <Badge key={idx} onClick={() => handleRemoveTag(idx)}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </Field>
                  <Field>
                    <Label htmlFor="image">Select Image</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleChooseFile}
                    />
                    <Button
                      type="button"
                      onClick={() => document.getElementById("image")?.click()}
                    >
                      Choose file
                    </Button>
                    {selectedImageName !== "" && (
                      <FieldDescription>
                        Selected image: {selectedImageName}
                      </FieldDescription>
                    )}
                  </Field>
                </FieldGroup>
                <DialogFooter className="bg-foreground">
                  <DialogClose asChild>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button onClick={handleUpload}>Upload</Button>
                </DialogFooter>
              </DialogContent>
            </>
          )}
        </>
      </Dialog>
    </>
  );
};

export default UploadImage;
