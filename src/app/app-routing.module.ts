import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadChildren: './modules/dashboard/dashboard.module#DashboardModule' },
  { path: 'grid', loadChildren: './modules/grid/grid.module#GridModule' },
  { path: 'form', loadChildren: './modules/form/form.module#FormModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
