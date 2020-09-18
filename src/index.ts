import clear from "clear";
import Configstore from "configstore";
import EventEmitter from "events";

import { displayMainMenu, interpretMenuAction } from "./menu";
import setup from "./setup";
import { titleScreen } from "./util";
import { AppState } from "./types";

/**
 * Main Program.
 */
const main = async (): Promise<void> => {
  // * Action Emitter keeps track of user input in the menu.
  const menuActionEmitter = new EventEmitter.EventEmitter();
  menuActionEmitter.on("actionCompleted", async (state: AppState) => {
    // * Display title screen
    await titleScreen("speckyboy-scraper");
    // * Display main menu
    await displayMainMenu(state);
    // * When user makes a choice, interpret the choice as an action
    await interpretMenuAction(state);
  });

  // * Store a config file on the user's machine
  const config = new Configstore("speckyboy-scraper");

  // * Application State
  const state: AppState = {
    config,
    menuAction: null,
    menuActionEmitter,
  };

  try {
    const isSetUp: boolean = config.get("isSetUp");

    if (!isSetUp) {
      // * The user has not gone through a setup process
      // * Set up the user
      await setup(state);
      clear();
    }

    await titleScreen("speckyboy-scraper");
    await displayMainMenu(state);
    await interpretMenuAction(state);
  } catch (e) {
    console.error("ERROR");
    console.log(state);
    console.error(e);
  }
};

// * Handle local development with `npm start`
if (process.argv[3] === "start") main();

export default main;
