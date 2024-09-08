import { ElementRef, ViewChild } from '@angular/core';
import { Vec } from './vec';
import { Camera } from './components/camera';
import { Bone } from './components/bone';
import { Ecs } from './ecs';
import { Joint } from './components/joint';

export class Renderer {
  private canvas: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private camera: Camera;
  private image = new Image();

  constructor(canvas: ElementRef<HTMLCanvasElement>) {
    this.canvas = canvas;
    const context = this.canvas.nativeElement.getContext('2d');

    if (context) {
      this.ctx = context;
    } else {
      throw Error(
        'Failed to get 2d content, come up with a solution dumbass ://'
      );
    }
    this.width = canvas.nativeElement.width;
    this.height = canvas.nativeElement.height;
    this.camera = new Camera(
      this.width,
      this.height,
      this.width,
      this.height,
      new Vec(0, 0)
    );
    this.image.src = 'assets/sprites/sbackground.png';
  }

  setCamera(camera: Camera) {
    this.camera = camera;
  }

  clearScreen(): void {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  private drawCircle(
    x: number,
    y: number,
    radius: number,
    color: string
  ): void {
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = 'black';
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.stroke();
  }

  private drawCurlingStone(
    x: number,
    y: number,
    radius: number,
    color: string,
    angle: number
  ) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(angle);
    this.ctx.translate(-x, -y);
    this.ctx.fillStyle = color;
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = '#3b3b3b';
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x + radius, y + radius / 3);
    this.ctx.stroke();
    this.ctx.restore();
  }

  private drawLine(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    color: string,
    lineWidth: number
  ) {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(endX, endY);
    this.ctx.stroke();
  }

  private drawImage(
    src: CanvasImageSource,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    this.ctx.drawImage(src, x, y, width, height);
  }

  public drawForeground() {
    this.ctx.drawImage(this.image, 0, 0, 1024, 450, 0, 0, 1024, 450);
    this.ctx.drawImage(this.image, 1024, 0, 1024, 450, 0, 0, 1024, 450);
    this.ctx.drawImage(this.image, 0, 450, 1024, 450, 0, 0, 1024, 450);
  }

  public drawBackgroundGame() {
    //this.ctx.drawImage(this.image, 0, 0, 1024,450, );
  }

  public drawBackground() {
    this.ctx.lineWidth = 1;
    this.drawCircle(
      this.width / 2 - this.camera.position.X,
      this.height / 2 - this.camera.position.Y,
      200,
      'blue'
    );
    this.drawCircle(
      this.width / 2 - this.camera.position.X,
      this.height / 2 - this.camera.position.Y,
      135,
      'white'
    );
    this.drawCircle(
      this.width / 2 - this.camera.position.X,
      this.height / 2 - this.camera.position.Y,
      75,
      'red'
    );
    this.drawCircle(
      this.width / 2 - this.camera.position.X,
      this.height / 2 - this.camera.position.Y,
      25,
      'white'
    );
    this.drawCircle(
      this.width / 2 - this.camera.position.X,
      2000 - this.height / 2 - this.camera.position.Y,
      200,
      'blue'
    );
    this.drawCircle(
      this.width / 2 - this.camera.position.X,
      2000 - this.height / 2 - this.camera.position.Y,
      135,
      'white'
    );
    this.drawCircle(
      this.width / 2 - this.camera.position.X,
      2000 - this.height / 2 - this.camera.position.Y,
      75,
      'red'
    );
    this.drawCircle(
      this.width / 2 - this.camera.position.X,
      2000 - this.height / 2 - this.camera.position.Y,
      25,
      'white'
    );
    this.drawLine(this.width / 2, 0, this.width / 2, 2000, 'red', 1);
    this.drawLine(
      0 - this.camera.position.X,
      this.height / 2 - this.camera.position.Y,
      this.width - this.camera.position.X,
      this.height / 2 - this.camera.position.Y,
      'red',
      1
    );
    this.drawLine(
      0 - this.camera.position.X,
      600 - this.camera.position.Y,
      this.width - this.camera.position.X,
      600 - this.camera.position.Y,
      'red',
      10
    );
    this.drawLine(
      0 - this.camera.position.X,
      1400 - this.camera.position.Y,
      this.width - this.camera.position.X,
      1400 - this.camera.position.Y,
      'red',
      10
    );
  }

  public drawSpeedControl(position: Vec, drawTo: Vec) {
    this.ctx.strokeStyle = 'green';
    this.ctx.beginPath();
    this.ctx.moveTo(
      position.X - this.camera.position.X,
      position.Y - this.camera.position.Y
    );
    this.ctx.lineTo(drawTo.X, drawTo.Y);
    this.ctx.stroke();
  }

  public render(position: Vec, color: string, radius: number, angle: number) {
    this.drawCurlingStone(
      position.X - this.camera.position.X,
      position.Y - this.camera.position.Y,
      radius,
      color,
      angle
    );
  }

  public renderJoint(joint: Joint, parent: Joint) {
    const radians = (parent.rotation * Math.PI) / 180;
    const endX = parent.position.X + parent.lengths[4] * Math.cos(radians);
    const endY = parent.position.Y + parent.lengths[4] * Math.sin(radians);
    this.ctx.save();
    this.ctx.translate(parent.position.X, parent.position.Y);
    this.ctx.rotate(radians);
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(parent.lengths[4], 0);
    this.ctx.strokeStyle = parent.color;
    this.ctx.stroke();
    this.ctx.restore();

    this.ctx.save();
    this.ctx.translate(endX, endY);
    this.ctx.rotate(radians);
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(joint.lengths[4], 0);
    this.ctx.strokeStyle = joint.color;
    this.ctx.stroke();
    this.ctx.restore();
    let i = 0;
    parent.angles.forEach((angle) => {
      this.ctx.save();
      this.ctx.translate(parent.position.X, parent.position.Y);
      this.ctx.rotate((angle * Math.PI) / 180 + radians);
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(parent.lengths[i], 0);
      this.ctx.lineWidth = 5;
      this.ctx.strokeStyle = parent.color;
      this.ctx.stroke();
      this.ctx.restore();
      i++;
    });
    i = 0;
    joint.angles.forEach((angle) => {
      this.ctx.save();
      this.ctx.translate(endX, endY);
      this.ctx.rotate((angle * Math.PI) / 180 + radians);
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(joint.lengths[i], 0);
      this.ctx.lineWidth = 5;
      this.ctx.strokeStyle = joint.color;
      this.ctx.stroke();
      this.ctx.restore();
      i++;
    });
  }

  public renderBone(image: CanvasImageSource, bone: Bone) {
    const radians = (bone.rotation * Math.PI) / 180;

    const endX = bone.position.X + bone.length * Math.cos(radians);
    const endY = bone.position.Y + bone.length * Math.sin(radians);

    this.ctx.strokeStyle = bone.color;
    this.ctx.lineWidth = 2;
    this.ctx.save();
    this.ctx.translate(bone.position.X, bone.position.Y);
    this.ctx.rotate(radians - Math.PI / 2);
    if (bone.flip) {
      this.ctx.scale(1, -1);
      this.ctx.scale(-1, 1);
    }
    //this.ctx.scale(-1, 1);
    this.ctx.translate(-bone.position.X, -bone.position.Y);
    this.ctx.drawImage(
      image,
      bone.startX,
      bone.startY,
      bone.endX,
      bone.endY,
      bone.position.X - bone.endX / 2,
      bone.position.Y,
      bone.endX,
      bone.endY
    );
    this.ctx.restore();

    // this.ctx.beginPath();
    // this.ctx.arc(bone.position.X, bone.position.Y, 2, 0, Math.PI * 2);
    // this.ctx.lineTo(endX, endY);
    // this.ctx.stroke();
  }

  public renderFont(text: string) {
    this.ctx.font = '50px Arial';
    this.ctx.strokeText(text, 0, 100);
  }

  drawDebug(characterPosition: Vec) {
    this.ctx.fillRect(characterPosition.X, characterPosition.Y, 100, 100);
  }

  draw(ecs: Ecs) {}
}
