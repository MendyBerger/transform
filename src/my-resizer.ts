import { LitElement, html, css, property, query } from 'lit-element';

export class MyResizer extends LitElement {
    @property({ type: Number })
    height: number = 100;

    @property({ type: Number, reflect: true })
    width: number = 100;

    @property({type: Number})
    rotation: number = 0;

    @property({type: Number})
    offsetTop: number = 0;

    @property({type: Number})
    offsetLeft: number = 0;

    @query(".slot-wrapper")
    slotWrapper!: HTMLElement;

    static styles = css`
        :host {
            display: block;
            position: relative;
            --node-size: 18px;
            padding: var(--node-size);

        }
        .slot-wrapper {
            display: flex;
            height: 1px;
            width: 1px;
            /* transform: scaleY(100); */
        }
        .node {
            height: var(--node-size);
            width: var(--node-size);
            background-color: blue;
            position: absolute;
        }
        .top {
            top: 0;
        }
        .bottom {
            bottom: 0;
        }
        .left {
            left: 0;
        }
        .right {
            right: 0;
        }
        .top.left, .bottom.right {
            cursor: nwse-resize;
        }
        .top.right, .bottom.left {
            cursor: nesw-resize;
        }
        .center-y {
            top: calc(50% - calc(var(--node-size) / 2));
            cursor: ew-resize;
        }
        .center-x {
            left: calc(50% - calc(var(--node-size) / 2));
            cursor: ns-resize;
        }
        .rotate-handle {
            top: -80px;
            left: calc(50% - calc(var(--node-size) / 2));
            cursor: grab;
        }
        ::slotted(img) {
            height: 100%;
            width: 100%;
        }


        /* * {
            all: initial;
            display: revert;
        } */
    `;

    private lockPage() {
        document.documentElement.setAttribute("locked", "");
    }

    private unlockPage() {
        document.documentElement.removeAttribute("locked");
    }

    private _topCenter(e: PointerEvent) {
        const target = e.target as HTMLElement;
        this.addDraggingListeners((e: PointerEvent) => {
            this._topResize(target, e);
            this._topTraslate(target, e);
        });
    }

    private _bottomCenter(e: PointerEvent) {
        const target = e.target as HTMLElement;
        this.addDraggingListeners((e: PointerEvent) => {
            this._bottomResize(target, e);
        });
    }

    private _leftCenter(e: PointerEvent) {
        const target = e.target as HTMLElement;
        this.addDraggingListeners((e: PointerEvent) => {
            this._leftTraslate(target, e);
            this._leftResize(target, e);
        });
    }

    private _rightCenter(e: PointerEvent) {
        const target = e.target as HTMLElement;
        this.addDraggingListeners((e: PointerEvent) => {
            this._rightResize(target, e);
        });
    }

    private _topTraslate(elementDragged: HTMLElement, e: PointerEvent) {
        if(this.height <= 0) return;
        const elementOffset = elementDragged.getBoundingClientRect().top - window.scrollY;
        const pointerOffset = e.pageY;

        this.offsetTop += (pointerOffset - elementOffset);
    }

    private _leftTraslate(elementDragged: HTMLElement, e: PointerEvent) {
        if(this.height <= 0) return;
        const elementOffset = elementDragged.getBoundingClientRect().left - window.scrollX;
        const pointerOffset = e.pageX;

        this.offsetLeft += (pointerOffset - elementOffset);
    }

    private _topResize(elementDragged: HTMLElement, e: PointerEvent) {
        let height = this.height - this._getOffsetTop(elementDragged, e);
        if(height < 0) height = 0;
            this.height = height;
    }

    private _bottomResize(elementDragged: HTMLElement, e: PointerEvent) {
        let height = this.height + this._getOffsetTop(elementDragged, e);
        if(height < 0) height = 0;
        this.height = height;
    }

    private _leftResize(elementDragged: HTMLElement, e: PointerEvent) {
        let width = this.width - this._getOffsetLeft(elementDragged, e);
        if(width < 0) width = 0;
        this.width = width;
    }

    private _rightResize(elementDragged: HTMLElement, e: PointerEvent) {
        let width = this.width + this._getOffsetLeft(elementDragged, e);
        if(width < 0) width = 0;
        this.width = width;
    }


    private _getOffsetTop(elementDragged: HTMLElement, e: PointerEvent) :number {
        const elementOffset = elementDragged.getBoundingClientRect().top - window.scrollY;
        const pointerOffset = e.pageY;
        return pointerOffset - elementOffset;
    }

    private _getOffsetLeft(elementDragged: HTMLElement, e: PointerEvent) :number {
        const elementOffset = elementDragged.getBoundingClientRect().left - window.scrollX;
        const pointerOffset = e.pageX;
        return pointerOffset - elementOffset;
    }

    private resizeDragStart(e: PointerEvent, directions: DirectionResizes[]) {
        for (const direction of directions) {
            switch (direction) {
                case DirectionResizes.Top:
                    this._topCenter(e);
                    break;
                case DirectionResizes.bottom:
                    this._bottomCenter(e);
                    break;
                case DirectionResizes.Left:
                    this._leftCenter(e);
                    break;
                case DirectionResizes.Right:
                    this._rightCenter(e);
                    break;
            }
        }
    }


    private rotatePointerDown() {
        const rect = this.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        this.addDraggingListeners((e: PointerEvent) => {
            var diffX = centerX - e.clientX;
            var diffY = centerY - e.clientY;

            var deg = Math.atan(diffY / diffX) * 180 / Math.PI;
            deg += 90;
            if(diffY > 0 && diffX > 0) {
                deg += 180; 
            } else if(diffY < 0 && diffX > 0) {
                deg -= 180;
            }
            this.rotation = deg;
        });
    }

    private addDraggingListeners(fn: (e: PointerEvent) => void) {
        const removeListener = (e: PointerEvent) => {
            console.log("caneled by", e.type);
            this.unlockPage();

            document.removeEventListener("pointermove", fn);
            document.removeEventListener("pointerup", removeListener);
            document.removeEventListener("pointerleave", removeListener);
            document.removeEventListener("pointercancel", removeListener);
        }

        this.lockPage();
        document.addEventListener("pointermove", fn);
        document.addEventListener("pointerup", removeListener);
        document.addEventListener("pointerleave", removeListener);
        document.addEventListener("pointercancel", removeListener);
    }

    render() {
        return html`
            <style>
                :host {
                    height: ${this.height}px;
                    
                    width: ${this.width}px;
                    transform: translate(${this.offsetLeft}px, ${this.offsetTop}px) rotate(${this.rotation}deg);
                }
                .slot-wrapper {
                    transform: scale(${this.width}, ${this.height}) translate(.5px, .5px);
                }
            </style>
            <div
                @pointerdown="${this.rotatePointerDown}"
                class="node rotate-handle"
            ></div>
            <div
                @pointerdown="${(e: PointerEvent) => this.resizeDragStart(e, [DirectionResizes.Top, DirectionResizes.Left])}"
                class="node top left"
            ></div>
            <div
                @pointerdown="${(e: PointerEvent) => this.resizeDragStart(e, [DirectionResizes.Top])}"
                class="node top center-x"
            ></div>
            <div
                @pointerdown="${(e: PointerEvent) => this.resizeDragStart(e, [DirectionResizes.Top, DirectionResizes.Right])}"
                class="node top right"
            ></div>
            <div
                @pointerdown="${(e: PointerEvent) => this.resizeDragStart(e, [DirectionResizes.Right])}"
                class="node right center-y"
            ></div>
            <div
                @pointerdown="${(e: PointerEvent) => this.resizeDragStart(e, [DirectionResizes.bottom, DirectionResizes.Right])}"
                class="node bottom right"
            ></div>
            <div
                @pointerdown="${(e: PointerEvent) => this.resizeDragStart(e, [DirectionResizes.bottom])}"
                class="node bottom center-x"
            ></div>
            <div
                @pointerdown="${(e: PointerEvent) => this.resizeDragStart(e, [DirectionResizes.bottom, DirectionResizes.Left])}"
                class="node bottom left"
            ></div>
            <div
                @pointerdown="${(e: PointerEvent) => this.resizeDragStart(e, [DirectionResizes.Left])}"
                class="node left center-y"
            ></div>
            <div
                class="slot-wrapper">
                <slot></slot>
            </div>
        `;
    }
}

customElements.define('my-resizer', MyResizer);


enum DirectionResizes {
    Top,
    bottom,
    Left,
    Right
}