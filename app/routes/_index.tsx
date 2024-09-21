import {
  ActionFunctionArgs,
  NodeOnDiskFile,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
  type MetaFunction,
} from "@remix-run/node";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Form } from "@remix-run/react";
import fs from "node:fs";
import os from "node:os";
// import FileInput from "~/_components/v0/file-input";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const uploadHandler = unstable_composeUploadHandlers(
    unstable_createFileUploadHandler({
      maxPartSize: 5_000_000, // 最大アップロードサイズ(byte)
      file: ({ filename }) => filename, // ディレクトリ内のファイル
    }),
    unstable_createMemoryUploadHandler()
  );
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  const file = formData.get("file") as NodeOnDiskFile;

  // Fileのアップロード先はデフォルトでos.tmpdirになる
  const fileContent = fs.readFileSync(`${os.tmpdir()}/${file.name}`);

  const s3Client = new S3Client({
    region: "ap-northeast-1",
    credentials: {
      accessKeyId: process.env.MINIO_ACCESS_KEY ?? "",
      secretAccessKey: process.env.MINIO_SECRET_ACCESS_KEY ?? "",
    },
    endpoint: process.env.MINIO_ENDPOINT,
  });

  const inputParams = {
    Bucket: "sample",
    Key: file.name,
    Body: fileContent,
  };

  s3Client.send(new PutObjectCommand(inputParams));

  return null;
};

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Form method="post" className="grid gap-5" encType="multipart/form-data">
        {/* <FileInput /> */}
        <input type="file" name="file" className="pointer inline-block" />
        <button
          type="submit"
          className="bg-white text-gray-800 w-16 p-2 rounded-2xl text-center mx-auto"
        >
          送信
        </button>
      </Form>
    </div>
  );
}
