import { Button } from "@mui/material";

export default function ImageUpload({
  onChange,
}: {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <Button variant="outlined" component="label">
      Upload Image
      <input hidden type="file" onChange={onChange} />
    </Button>
  );
}
