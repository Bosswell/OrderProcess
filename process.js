class OrderProcess {
    constructor(options) {
        let defaults = {
            isClickableForward: false,
            isClickableBackward: true,
            reIndexAfterRemove: true,
            sectionWidth: null,
            onClick: function (index) {}
        };

        this.options = Object.assign(defaults, options);
        this.currentIndex = 0;

        if (this.options.sectionWidth !== null) {
            document.getElementById("order-process").style.cssText = "--order-line-point-width: " + this.options.sectionWidth + "px";
        }

        this.bulletPoints = document.querySelectorAll("#order-process .order-line__point");
        this.initListners();
    }

    initListners() {
        this.bulletPoints.forEach((element) => {
            element.addEventListener("click", () => {
                let index = element.getAttribute('data-index');
                if ((index > this.currentIndex && this.options.isClickableForward !== false) || (index < this.currentIndex && this.options.isClickableBackward === true)) {
                    this.moveTo(index);
                    this.options.onClick(index);
                    this.currentIndex = index;
                }
            });
        });
    }

    next() {
        if (this.bulletPoints[this.currentIndex + 1]) {
            this.bulletPoints[this.currentIndex].classList.remove("current-bullet");
            this.bulletPoints[++this.currentIndex].classList.add("current-bullet", "active-bullet");
        }

        return this;
    }

    previous() {
        if (this.bulletPoints[this.currentIndex - 1]) {
            this.bulletPoints[this.currentIndex].classList.remove("current-bullet", "active-bullet");
            this.bulletPoints[--this.currentIndex].classList.add("current-bullet");
        }

        return this;
    }

    moveTo(position) {
        this.bulletPoints.forEach((el) => {
            let index = el.getAttribute('data-index');

            if (index <= position) {
                el.classList.add("active-bullet");
            } else {
                el.classList.remove("active-bullet");
            }
        });

        this.bulletPoints[this.currentIndex].classList.remove("current-bullet");
        this.bulletPoints[position].classList.add("current-bullet");
    }

    removeElement(index) {
        try {
            this.bulletPoints[index].remove();
            this.bulletPoints = Array.prototype.slice.call(this.bulletPoints).filter(function (element, id) {
                if (index === id) {

                    return false;
                }

                return true;
            });

            document.getElementById("order-process").style.cssText = "--order-process-sections: " + this.bulletPoints.length;

            if (this.options.reIndexAfterRemove === true) {
                this.reIndex();
            }

        } catch {
            throw new Error("An element can not be removed because it does not exist -> removeElement("+ index + ")");
        }
    }

    reIndex() {
        let i = 0;

        this.bulletPoints.forEach(function (element) {
            element.setAttribute("data-index", i++);
        })
    }
}