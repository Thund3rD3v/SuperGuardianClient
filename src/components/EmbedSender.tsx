import {
  Accordion,
  AccordionItem,
  Button,
  Checkbox,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";

import { useState } from "react";
import { IAuthState, IChannel, IEmbed, IEmbedField } from "../types";
import DiscordEmbed from "./DiscordEmbed";
import { errorToast, successToast } from "../toasts";
import Markdown from "../lib/markdown/Markdown";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  channelsData: any;
  auth: IAuthState;
}

function EmbedSender({ channelsData, auth }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  // Author
  const [author, setAuthor] = useState("");
  const [authorURL, setAuthorURL] = useState("");
  const [authorIconURL, setAuthorIconURL] = useState("");

  // Body
  const [title, setTitle] = useState("");
  const [url, setURL] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#202225");

  // Images
  const [image, setImage] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  // Fields
  const [fields, setFields] = useState<IEmbedField[]>([]);

  // Footer
  const [footer, setFooter] = useState("");
  const [footerIcon, setFooterIcon] = useState("");
  const [timestamp, setTimestamp] = useState(false);

  // Main State
  const [content, setContent] = useState("");
  const [selectedChannel, setSelectedChannel] = useState(new Set([]));

  const embed: IEmbed = {
    author: {
      name: author.trim(),
      url: authorURL.trim(),
      iconUrl: authorIconURL.trim(),
    },
    title: title.trim(),
    url: url.trim(),
    description: description.trim(),
    fields: fields.map((field) => ({
      name: field.name.trim(),
      value: field.value.trim(),
      inline: field.inline,
    })),
    image: {
      url: image.trim(),
    },
    thumbnail: {
      url: thumbnail.trim(),
    },
    color: parseInt(color.replace("#", ""), 16),
    footer: {
      text: footer.trim(),
      iconUrl: footerIcon.trim(),
    },
    timestamp: timestamp ? new Date().toISOString() : undefined,
  };

  async function handleSend() {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API}/send-embed`, {
        method: "POST",
        headers: {
          Authorization: auth.password,
        },
        body: JSON.stringify({
          embed,
          content: content,
          channelId: Array.from(selectedChannel)[0],
        }),
      });
      const data = await res.json();
      if (data?.success) {
        successToast(data?.message);
      } else {
        errorToast(data?.message);
      }

      setIsLoading(false);
    } catch (err) {
      console.error(err);
      errorToast("Uh oh, an error has encountered");
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col lg:flex-row justify-start items-start gap-6 mb-10">
      <form className="px-4 py-6 border bg-zinc-800/20 border-zinc-800 shadow-lg w-full h-96 max-w-4xl rounded-lg overflow-y-auto">
        <h2 className="text-3xl font-semibold">Embed Sender</h2>
        <Accordion
          variant="light"
          isCompact
          showDivider={false}
          selectionMode="multiple">
          <AccordionItem
            key="embed-author"
            aria-label="Author"
            title="Author"
            onKeyDown={(ev) => {
              ev.stopPropagation();
            }}>
            <div className="flex flex-col gap-2">
              <Input
                value={author}
                onValueChange={setAuthor}
                label="Author Name"
              />
              <Input
                value={authorURL}
                onValueChange={setAuthorURL}
                label="Author URL"
              />
              <Input
                value={authorIconURL}
                onValueChange={setAuthorIconURL}
                label="Author Icon URL"
              />
            </div>
          </AccordionItem>

          <AccordionItem
            key="embed-body"
            aria-label="Body"
            title="Body"
            onKeyDown={(ev) => {
              ev.stopPropagation();
            }}>
            <div className="flex flex-col gap-2">
              <Input label="Title" value={title} onValueChange={setTitle} />
              <Input label="Title URL" value={url} onValueChange={setURL} />
              <Textarea
                label="Description"
                value={description}
                onValueChange={setDescription}
              />
              <Input
                label="Color"
                description="Format: #ffffff"
                value={color}
                onValueChange={setColor}
              />
            </div>
          </AccordionItem>

          <AccordionItem
            key="embed-images"
            aria-label="Images"
            title="Images"
            onKeyDown={(ev) => {
              ev.stopPropagation();
            }}>
            <div className="flex flex-col gap-2">
              <Input label="Image URL" value={image} onValueChange={setImage} />
              <Input
                label="Thumbnail URL"
                value={thumbnail}
                onValueChange={setThumbnail}
              />
            </div>
          </AccordionItem>

          <AccordionItem
            key="embed-fields"
            aria-label="Fields"
            title="Fields"
            onKeyDown={(ev) => {
              ev.stopPropagation();
            }}>
            <div className="flex flex-col gap-4">
              {fields.map((field, idx) => (
                <div key={`embed-field-${idx}`} className="flex flex-col gap-2">
                  <Input
                    label="Name"
                    size="sm"
                    value={field.name}
                    onValueChange={(value) => {
                      setFields((prev) => {
                        const newFields = [...prev];
                        newFields[idx].name = value;
                        return newFields;
                      });
                    }}
                  />
                  <div>
                    <Input
                      label="Value"
                      value={field.value}
                      size="sm"
                      onValueChange={(value) => {
                        setFields((prev) => {
                          const newFields = [...prev];
                          newFields[idx].value = value;
                          return newFields;
                        });
                      }}
                    />
                    <div className="flex mt-1 justify-between">
                      <Checkbox
                        isSelected={field.inline}
                        onValueChange={(value) => {
                          setFields((prev) => {
                            const newFields = [...prev];
                            newFields[idx].inline = value;
                            return newFields;
                          });
                        }}
                        size="sm">
                        Inline
                      </Checkbox>
                      <Button
                        color="danger"
                        size="sm"
                        variant="flat"
                        isIconOnly
                        onClick={() => {
                          setFields((prev) => {
                            const newFields = [...prev];
                            newFields.splice(idx, 1);
                            return newFields;
                          });
                        }}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-4 h-4">
                          <path
                            fillRule="evenodd"
                            d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button
              onClick={() => {
                setFields((prev) => {
                  const newFields = [...prev];
                  newFields.push({ name: "", value: "", inline: false });
                  return newFields;
                });
              }}
              color="success"
              variant="flat"
              className="mt-4"
              size="sm">
              Add
            </Button>
          </AccordionItem>

          <AccordionItem
            key="embed-footer"
            aria-label="Footer"
            title="Footer"
            onKeyDown={(ev) => {
              ev.stopPropagation();
            }}>
            <div className="flex flex-col gap-2">
              <Input label="Text" value={footer} onValueChange={setFooter} />
              <Input
                label="Footer Icon URL"
                value={footerIcon}
                onValueChange={setFooterIcon}
              />
              <Checkbox checked={timestamp} onValueChange={setTimestamp}>
                TimeStamp
              </Checkbox>
            </div>
          </AccordionItem>
        </Accordion>

        <div className="mt-4 flex flex-col gap-2">
          <Input label="Content" value={content} onValueChange={setContent} />
          <Select
            onSelectionChange={setSelectedChannel}
            selectedKeys={selectedChannel}
            label="Channel">
            {channelsData?.data?.channels
              .filter(
                (channel: IChannel) => channel.type == 0 || channel.type == 5
              )
              .map((channel: IChannel) => {
                return (
                  <SelectItem
                    key={channel.id}
                    value={channel.id}
                    startContent={
                      channel.type == 5 ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-5 h-5">
                          <path d="M13.92 3.845a19.361 19.361 0 01-6.3 1.98C6.765 5.942 5.89 6 5 6a4 4 0 00-.504 7.969 15.974 15.974 0 001.271 3.341c.397.77 1.342 1 2.05.59l.867-.5c.726-.42.94-1.321.588-2.021-.166-.33-.315-.666-.448-1.004 1.8.358 3.511.964 5.096 1.78A17.964 17.964 0 0015 10c0-2.161-.381-4.234-1.08-6.155zM15.243 3.097A19.456 19.456 0 0116.5 10c0 2.431-.445 4.758-1.257 6.904l-.03.077a.75.75 0 001.401.537 20.902 20.902 0 001.312-5.745 1.999 1.999 0 000-3.545 20.902 20.902 0 00-1.312-5.745.75.75 0 00-1.4.537l.029.077z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-5 h-5">
                          <path
                            fillRule="evenodd"
                            d="M10 3c-4.31 0-8 3.033-8 7 0 2.024.978 3.825 2.499 5.085a3.478 3.478 0 01-.522 1.756.75.75 0 00.584 1.143 5.976 5.976 0 003.936-1.108c.487.082.99.124 1.503.124 4.31 0 8-3.033 8-7s-3.69-7-8-7zm0 8a1 1 0 100-2 1 1 0 000 2zm-2-1a1 1 0 11-2 0 1 1 0 012 0zm5 1a1 1 0 100-2 1 1 0 000 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )
                    }>
                    {channel.name}
                  </SelectItem>
                );
              })}
          </Select>
          <Button isLoading={isLoading} color="primary" onClick={handleSend}>
            Send
          </Button>
        </div>
      </form>
      <div className="px-4 py-6 border bg-zinc-800/20 border-zinc-800 shadow-lg w-full h-96 max-w-4xl rounded-lg overflow-y-auto">
        <h2 className="text-3xl font-semibold flex gap-2 items-center mb-2">
          Preview
        </h2>
        <Markdown className="mb-1">{content}</Markdown>
        <DiscordEmbed embed={embed} />
      </div>
    </div>
  );
}

export default EmbedSender;
