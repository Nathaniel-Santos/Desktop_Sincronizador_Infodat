import React from 'react'
import Download from '@mui/icons-material/Download';
import Home from '@mui/icons-material/Home'
import UploadClound from '@mui/icons-material/CloudUpload';
import Settings from '@mui/icons-material/Settings';
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';

export const SideBarData = [
  {
    Codigo: "100",
    title: "Início",
    link: "/Home",
    icon: <Home />,
    active: "Active"
  },
  {
    Codigo: "200",
    title: "Baixar Notas",
    link: "/notas/download",
    icon: <Download />,
    active: "Active"
  },
  {
    Codigo: "300",
    title: "Atualizar Site",
    icon: <UploadClound />,
    link: "/site/upload",
    active: "Active"
  },
  {
    Codigo: "400",
    title: "Conexão Web",
    icon: <SettingsEthernetIcon />,
    link: "/connectionWeb",
    active: "Active"
  },
  {
    Codigo: "500",
    title: "Configuração",
    icon: <Settings />,
    link: "/config",
    active: "Inactive"
  }
]
