import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';

const routes: Routes = [
  { path: '', component: ChatComponent },   // ruta raíz muestra el chat
  { path: '**', redirectTo: '' },           // cualquier ruta desconocida redirige a chat
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
