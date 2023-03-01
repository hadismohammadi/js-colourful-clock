window.addEventListener("DOMContentLoaded", () => {
  const clock = new ProgressClock("#clock");
});

class ProgressClock {
  constructor(qs) {
    this.el = document.querySelector(qs);
    this.time = 0;
    this.updateTimeout = null;
    this.ringTimeouts = [];
    this.update();
  }
  getDayOfWeek(day) {
    switch (day) {
      case 1:
        return "Monday";
      case 2:
        return "Tuesday";
      case 3:
        return "Wednesday";
      case 4:
        return "Thursday";
      case 5:
        return "Friday";
      case 6:
        return "Saturday";
      default:
        return "Sunday";
    }
  }
  getMonthInfo(mo, yr) {
    switch (mo) {
      case 1:
        return { name: "February", days: yr % 4 === 0 ? 29 : 28 };
      case 2:
        return { name: "March", days: 31 };
      case 3:
        return { name: "April", days: 30 };
      case 4:
        return { name: "May", days: 31 };
      case 5:
        return { name: "June", days: 30 };
      case 6:
        return { name: "July", days: 31 };
      case 7:
        return { name: "August", days: 31 };
      case 8:
        return { name: "September", days: 30 };
      case 9:
        return { name: "October", days: 31 };
      case 10:
        return { name: "November", days: 30 };
      case 11:
        return { name: "December", days: 31 };
      default:
        return { name: "January", days: 31 };
    }
  }
  update() {
    this.time = new Date();

    if (this.el) {
      // date and time
      let dayOfWeek = this.time.getDay();
      let year = this.time.getFullYear();
      let month = this.time.getMonth();
      let day = this.time.getDate();
      let hr = this.time.getHours();
      let min = this.time.getMinutes();
      let sec = this.time.getSeconds();
      let dayOfWeekName = this.getDayOfWeek(dayOfWeek);
      let monthInfo = this.getMonthInfo(month, year);
      let m_progress = sec / 60;
      let h_progress = (min + m_progress) / 60;
      let d_progress = (hr + h_progress) / 24;
      let mo_progress = (day - 1 + d_progress) / monthInfo.days;
      let units = [
        {
          label: "w",
          value: dayOfWeekName,
        },
        {
          label: "mo",
          value: monthInfo.name,
          progress: mo_progress,
        },
        {
          label: "d",
          value: day,
          progress: d_progress,
        },
        {
          label: "h",
          value: hr > 12 ? hr - 12 : hr,
          progress: h_progress,
        },
        {
          label: "m",
          value: min < 10 ? "0" + min : min,
          progress: m_progress,
        },
        {
          label: "s",
          value: sec < 10 ? "0" + sec : sec,
        },
        {
          label: "ap",
          value: hr > 12 ? "PM" : "AM",
        },
      ];

      // flush out the timeouts
      this.ringTimeouts.forEach((t) => {
        clearTimeout(t);
      });
      this.ringTimeouts = [];

      // update the display
      units.forEach((u) => {
        // rings
        const ring = this.el.querySelector(`[data-ring="${u.label}"]`);

        if (ring) {
          const strokeDashArray = ring.getAttribute("stroke-dasharray");
          const fill360 = "progress-clock__ring-fill--360";

          if (strokeDashArray) {
            // calculate the stroke
            const circumference = +strokeDashArray.split(" ")[0];
            const strokeDashOffsetPct = 1 - u.progress;

            ring.setAttribute(
              "stroke-dashoffset",
              strokeDashOffsetPct * circumference
            );

            // add the fade-out transition, then remove it
            if (strokeDashOffsetPct === 1) {
              ring.classList.add(fill360);

              this.ringTimeouts.push(
                setTimeout(() => {
                  ring.classList.remove(fill360);
                }, 600)
              );
            }
          }
        }

        // digits
        let unit = this.el.querySelector(`[data-unit="${u.label}"]`);

        if (unit) unit.innerText = u.value;
      });
    }

    clearTimeout(this.updateTimeout);
    this.updateTimeout = setTimeout(this.update.bind(this), 1e3);
  }
}
