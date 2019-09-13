import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { CropperConfig } from './models/cropper.config';

@Component({
    selector: 'cropper',
    templateUrl: './cropper.component.html',
    styleUrls: ['./cropper.component.scss']
})
export class CropperComponent implements OnInit, AfterViewInit {

    private x: number;
    private y: number;

    private dw: number;
    private dh: number;

    private selectionBoxLineWidth: number = 2;

    private offsetX: number;
    private offsetY: number;

    private isSelecting: boolean = false;

    @Input() config: CropperConfig;

    constructor() {

    }

    ngOnInit() {

    }

    ngAfterViewInit(): void {
        this.initCanvas();
    }


    private initCanvas() {

        let canvas = <HTMLCanvasElement>document.getElementById('imageLayer');
        let ctxImage = canvas.getContext('2d');

        this.drawBackground(ctxImage);
        this.drawImage(ctxImage);
    }

    private drawBackground(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.fillStyle = "#323639";
        ctx.fillRect(0, 0, this.config.width, this.config.height);

    }

    private drawImage(ctx: CanvasRenderingContext2D) {
        var img = new Image();

        this.dw = this.config.width * 0.9;
        this.dh = this.config.height * 0.9;

        this.x = (this.config.width / 2) - (this.dw / 2);
        this.y = (this.config.height / 2) - (this.dh / 2);

        let that = this;

        img.onload = () => {

            //on désine l'image a 0, 0 (en haut à gauche)
            ctx.drawImage(img, this.x, this.y, this.dw, this.dh);

            //une fois l'image load on affiche le rectangle de séleciton
            let canvasSelection = <HTMLCanvasElement>document.getElementById('selectionLayer');
            let ctxSelection = canvasSelection.getContext('2d');

            //on hook le mouseMove
            canvasSelection.addEventListener('mousemove', (e) => { that.moveSelection(e, canvasSelection, ctxSelection); } );
            canvasSelection.addEventListener('mousedown', (e) => { that.isSelecting = true; } );

            that.centerSelectionBox(ctxSelection);
            that.drawSelectionBox(ctxSelection);
        };

        img.src = this.config.imageBase64;
        console.log(img.src);
    }


    private centerSelectionBox(ctx: CanvasRenderingContext2D){
        this.offsetX = (this.config.width / 2) - (this.config.cropWidth / 2);
        this.offsetY = (this.config.height / 2) - (this.config.cropHeight / 2);
    }

    private drawSelectionBox(ctx: CanvasRenderingContext2D) {
       
        //premièrement on dessine un overlay
        ctx.beginPath();
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, this.config.width, this.config.height);


        //puis un rectangle de sélection
        ctx.beginPath();
        ctx.lineWidth = this.selectionBoxLineWidth;
        ctx.strokeStyle = "hotpink";
        ctx.strokeRect(this.offsetX - this.selectionBoxLineWidth, this.offsetY - this.selectionBoxLineWidth, this.config.cropWidth + this.selectionBoxLineWidth, this.config.cropHeight + this.selectionBoxLineWidth);

        //puis on clear l'overlay à l'intérieur du rectangle de sélection
        ctx.beginPath();
        ctx.clearRect(this.offsetX, this.offsetY, this.config.cropWidth, this.config.cropHeight);
    }

    private moveSelection(e, canvas, ctx) {

        var mousePos = this.getMousePos(canvas, e);

        // if (mousePos.x >= this.offsetX && mousePos.x <= this.offsetX + this.config.cropWidth &&
        //     mousePos.y >= this.offsetY && mousePos.y <= this.offsetY + this.config.cropHeight) {
           
            this.offsetX = mousePos.x;
            this.offsetY = mousePos.y;

       // } 
            
        if(this.isSelecting){
            this.drawSelectionBox(ctx); 
        }
    }


    private getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect(), // abs. size of element
            scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
            scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

        return {
            x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
            y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
        }
    }

}


