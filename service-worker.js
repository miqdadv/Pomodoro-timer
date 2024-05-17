// function createContextMenus(){
//     chrome.contextMenus.create({
//        id:"start-timer",
//        title:"Start Timer",
//        contexts:["all"]
//     });
// }

let seconds = 25 * 60;

let timerIsRunning = false;

chrome.alarms.onAlarm.addListener((alarm) => {
  if (!timerIsRunning) {
    return;
  }

  seconds--;

  const minRemaining = Math.floor(seconds / 60) + "M";

  chrome.action.setBadgeText(
    {
      text: minRemaining,
    },
    () => {}
  );

  if (seconds <= 0) {
    clearAlarm("pomodoro-timer");
    createNotification("Hurray!!! great focus,take a break!!!");
    chrome.contextMenus.update("start-timer", {
      title: "Start Timer",
      contexts: ["all"],
    });
    chrome.action.setBadgeText(
      {
        text: "-",
      },
      () => {}
    );
    chrome.action.setBadgeBackgroundColor({ color: "yellow" }, () => {});
  }
});

function createAlarm(name) {
  chrome.alarms.create(name, {
    periodInMinutes: 1 / 60,
  });
}

function createNotification(message) {
  const opt = {
    type: "list",
    title: "Pomodoro Timer",
    message,
    items: [{ title: "Pomodoro Timer", message: message }],
    iconUrl: "icons/timer-128.png",
  };

  chrome.notifications.create(opt);
}

function clearAlarm(name) {
  chrome.alarms.clear(name, (wasCleared) => {
    console.log(wasCleared);
  });
}

chrome.contextMenus.create({
  id: "start-timer",
  title: "Start Timer",
  contexts: ["all"],
});

chrome.contextMenus.create({
  id: "reset-timer",
  title: "Reset Timer",
  contexts: ["all"],
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  switch (info.menuItemId) {
    case "reset-timer":
      chrome.contextMenus.update("start-timer", {
        title: "Start Timer",
        contexts: ["all"],
      });
      chrome.action.setBadgeText(
        {
          text: "R",
        },
        () => {}
      );
      clearAlarm("pomodoro-timer");
      chrome.action.setBadgeBackgroundColor({ color: "green" }, () => {});
      createNotification("Your timer has been Reset");
      timerIsRunning = false;
      seconds = 0;
      break;
    case "start-timer":
      if (timerIsRunning) {
        chrome.action.setBadgeText(
          {
            text: "S",
          },
          () => {}
        );
        chrome.action.setBadgeBackgroundColor({ color: "yellow" }, () => {});
        createNotification("Your timer has stopped");
        chrome.contextMenus.update("start-timer", {
          title: "Start Timer",
          contexts: ["all"],
        });
        clearAlarm("pomodoro-timer");
        timerIsRunning = false;
        return;
      }
      seconds=seconds<=0?25*60:seconds;
      createNotification("Your timer has started");
      timerIsRunning = true;
      createAlarm("pomodoro-timer");
      chrome.action.setBadgeBackgroundColor({ color: "blue" }, () => {});
      chrome.contextMenus.update("start-timer", {
        title: "Stop Timer",
        contexts: ["all"],
      });
      break;

    default:
      break;
  }
});

chrome.action.setBadgeBackgroundColor({ color: "blue" }, () => {});
