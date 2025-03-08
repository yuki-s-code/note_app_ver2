import { FC } from "react";
import { useAppDispatch } from "../../libs/app/hooks";
import { setNewBoardModal } from "../../slices/boardSlice";
import {
  IconButton,
  SpeedDial,
  SpeedDialHandler,
} from "@material-tailwind/react";
import { PlusIcon } from "lucide-react";

const BoardInput: FC = () => {
  const dispatch = useAppDispatch();

  const newModalOpenHandler = (t: boolean) => {
    dispatch(
      setNewBoardModal({
        open: t,
      })
    );
  };

  return (
    <div>
      <div className="flex opacity-50">
        <div
          className="flex items-center justify-center"
          onClick={() => newModalOpenHandler(true)}
        >
          <SpeedDial>
            <SpeedDialHandler>
              <IconButton
                placeholder="true"
                onPointerEnterCapture
                onPointerLeaveCapture
                size="lg"
                className="rounded-full"
              >
                <PlusIcon className="h-8 w-8 transition-transform group-hover:rotate-45" />
              </IconButton>
            </SpeedDialHandler>
          </SpeedDial>
        </div>
      </div>
    </div>
  );
};

export default BoardInput;
