// Root.tsx

import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Card,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemPrefix,
  Typography,
} from "@material-tailwind/react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  Cog,
  Factory,
  Mail,
  Menu,
  Notebook,
  PowerIcon,
  Presentation,
  UserCircleIcon,
  X,
} from "lucide-react";
import MainLogo from "../assets/ashiya_logo.jpg";
import { BotTop } from "@/components/bot/BotTop";
import { BotSetting } from "@/components/bot/BotSetting";

export const Root = () => {
  const [open, setOpen] = useState<number>(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [editedOpen, setEditedOpen] = useState<boolean>(false);

  const handleOpen = (value: number) => {
    setOpen(open === value ? 0 : value);
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      {!editedOpen ? (
        <div className="flex">
          <div className="flex-auto">
            <div className="flex flex-col">
              <div>
                <IconButton
                  placeholder
                  onPointerEnterCapture
                  onPointerLeaveCapture
                  onClick={openDrawer}
                  className="opacity-40 relative"
                  variant="text"
                  size="lg"
                >
                  {isDrawerOpen ? (
                    <X className="h-6 w-6 stroke-2" />
                  ) : (
                    <Menu className="h-6 w-6 stroke-2" />
                  )}
                </IconButton>
                <Drawer
                  placeholder
                  onPointerEnterCapture
                  onPointerLeaveCapture
                  open={isDrawerOpen}
                  onClose={closeDrawer}
                  className="overflow-y-auto"
                >
                  <Card
                    placeholder
                    onPointerEnterCapture
                    onPointerLeaveCapture
                    color="transparent"
                    shadow={false}
                    className="h-[calc(100vh-2rem)] w-full p-4"
                  >
                    <div className="mb-2 flex items-center gap-4 p-4">
                      <img src={MainLogo} alt="brand" className="h-8 w-8" />
                      <Typography
                        placeholder
                        onPointerEnterCapture
                        onPointerLeaveCapture
                        variant="h5"
                        color="blue-gray"
                      >
                        Ashiya.com
                      </Typography>
                    </div>
                    <List
                      placeholder
                      onPointerEnterCapture
                      onPointerLeaveCapture
                    >
                      <Accordion
                        placeholder
                        onPointerEnterCapture
                        onPointerLeaveCapture
                        open={open === 1}
                        icon={
                          <ChevronDownIcon
                            strokeWidth={2.5}
                            className={`mx-auto h-4 w-4 transition-transform ${
                              open === 1 ? "rotate-180" : ""
                            }`}
                          />
                        }
                      >
                        <Link to="/root">
                          <ListItem
                            placeholder
                            onPointerEnterCapture
                            onPointerLeaveCapture
                            className="p-0"
                            selected={open === 1}
                          >
                            <AccordionHeader
                              placeholder
                              onPointerEnterCapture
                              onPointerLeaveCapture
                              onClick={() => handleOpen(1)}
                              className="border-b-0 p-3"
                            >
                              <ListItemPrefix
                                placeholder
                                onPointerEnterCapture
                                onPointerLeaveCapture
                              >
                                <Presentation className="h-5 w-5" />
                              </ListItemPrefix>
                              <Typography
                                placeholder
                                onPointerEnterCapture
                                onPointerLeaveCapture
                                color="blue-gray"
                                className="mr-auto font-normal"
                              >
                                Dashboard
                              </Typography>
                            </AccordionHeader>
                          </ListItem>
                        </Link>

                        <AccordionBody className="py-1">
                          <List
                            className="p-0"
                            placeholder
                            onPointerEnterCapture
                            onPointerLeaveCapture
                          >
                            <ListItem
                              placeholder
                              onPointerEnterCapture
                              onPointerLeaveCapture
                            >
                              <ListItemPrefix
                                placeholder
                                onPointerEnterCapture
                                onPointerLeaveCapture
                              >
                                <ChevronRightIcon
                                  strokeWidth={3}
                                  className="h-3 w-5"
                                />
                              </ListItemPrefix>
                              分析
                            </ListItem>
                            <ListItem
                              placeholder
                              onPointerEnterCapture
                              onPointerLeaveCapture
                            >
                              <ListItemPrefix
                                placeholder
                                onPointerEnterCapture
                                onPointerLeaveCapture
                              >
                                <ChevronRightIcon
                                  strokeWidth={3}
                                  className="h-3 w-5"
                                />
                              </ListItemPrefix>
                              レポート
                            </ListItem>
                          </List>
                        </AccordionBody>
                      </Accordion>
                      <hr className="my-2 border-blue-gray-50" />
                      <Link to="profile">
                        <ListItem
                          placeholder
                          onPointerEnterCapture
                          onPointerLeaveCapture
                        >
                          <ListItemPrefix
                            placeholder
                            onPointerEnterCapture
                            onPointerLeaveCapture
                          >
                            <UserCircleIcon className="h-5 w-5" />
                          </ListItemPrefix>
                          Profile
                        </ListItem>
                      </Link>
                      <Link to="news">
                        <ListItem
                          placeholder
                          onPointerEnterCapture
                          onPointerLeaveCapture
                        >
                          <ListItemPrefix
                            placeholder
                            onPointerEnterCapture
                            onPointerLeaveCapture
                          >
                            <Factory className="h-5 w-5" />
                          </ListItemPrefix>
                          News
                        </ListItem>
                      </Link>
                      <Link to="message">
                        <ListItem
                          placeholder
                          onPointerEnterCapture
                          onPointerLeaveCapture
                        >
                          <ListItemPrefix
                            placeholder
                            onPointerEnterCapture
                            onPointerLeaveCapture
                          >
                            <Mail className="h-5 w-5" />
                          </ListItemPrefix>
                          Message
                        </ListItem>
                      </Link>
                      <Link to="note">
                        <ListItem
                          placeholder
                          onPointerEnterCapture
                          onPointerLeaveCapture
                        >
                          <ListItemPrefix
                            placeholder
                            onPointerEnterCapture
                            onPointerLeaveCapture
                          >
                            <Notebook className="h-5 w-5" />
                          </ListItemPrefix>
                          Note
                        </ListItem>
                      </Link>
                      <hr className="my-2 border-blue-gray-50" />
                      <ListItem
                        placeholder
                        onPointerEnterCapture
                        onPointerLeaveCapture
                      >
                        <ListItemPrefix
                          placeholder
                          onPointerEnterCapture
                          onPointerLeaveCapture
                        >
                          <Cog className="h-5 w-5" />
                        </ListItemPrefix>
                        Settings
                      </ListItem>
                      <ListItem
                        placeholder
                        onPointerEnterCapture
                        onPointerLeaveCapture
                      >
                        <ListItemPrefix
                          placeholder
                          onPointerEnterCapture
                          onPointerLeaveCapture
                        >
                          <PowerIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        Log Out
                      </ListItem>
                    </List>
                  </Card>
                </Drawer>
              </div>
              <div className="z-50">
                <BotTop editedOpen={editedOpen} setEditedOpen={setEditedOpen} />
              </div>
            </div>
            <div>
              <Outlet />
            </div>
          </div>
        </div>
      ) : (
        <BotSetting setEditedOpen={setEditedOpen} />
      )}
    </>
  );
};

export default Root;
