import React from "react";

import { Textarea } from "@/components/ui/textarea";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { secondsToTime } from "../../utils/timeUtils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  ArrowUturnRightIcon,
  SparklesIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const CaptionDisplay = ({ data }) => {
  const { masterCaptions, subCaptions, clearMasterCaptions } = data;
  return (
    <Table>
      <TableHeader className="sticky top-0 outline outline-1 outline-gray-100">
        <TableRow className="hover:bg-white bg-white ">
          <TableHead className="w-[10px]"></TableHead>
          <TableHead className="flex items-center w-[400px]">
            <p>Original</p>
            <XCircleIcon
              className="w-4 h-4 ml-2 duration-300 transition-colors hover:text-red-500 cursor-pointer"
              onClick={clearMasterCaptions}
            />
          </TableHead>
          <TableHead>
            <div className="flex flex-wrap gap-x-2 ">
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="chinese">Chinese</SelectItem>
                </SelectContent>
              </Select>
              <Button
                className="h-8 border-cyan-500 text-primary hover:text-primary/70"
                variant="outline"
              >
                Translate
                <SparklesIcon className="w-4 h-4 ml-2" />
              </Button>
              <Button
                className="h-8 border-cyan-500 text-primary hover:text-primary/70"
                variant="outline"
              >
                Merge{" "}
                <ArrowUturnRightIcon className="w-4 h-4 ml-2 rotate-180" />
              </Button>
            </div>
          </TableHead>
          <TableHead className="text-left">Start</TableHead>
          <TableHead className="text-left">End</TableHead>
          <TableHead className="text-left"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {masterCaptions.map((caption, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium ">{caption.index}</TableCell>
            <TableCell className="p-1.5">
              <Textarea value={caption.text} />
            </TableCell>
            <TableCell>{caption.transcript}</TableCell>
            <TableCell className="w-36">
              <Input defaultValue={caption.start} className="w-32 " />
            </TableCell>
            <TableCell className="w-36">
              <Input defaultValue={caption.end} className="w-32 " />
            </TableCell>
            <TableCell>
              <XCircleIcon className=" size-6 text-gray-300 hover:text-red-500 cursor-pointer duration-300 transition" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CaptionDisplay;
