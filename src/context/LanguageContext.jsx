import React, { createContext, useContext, useState, useEffect } from "react";

const translations = {
  uz: {
    // Navigation / Sidebar
    "nav.dashboard": "Asosiy",
    "nav.teachers": "O'qituvchilar",
    "nav.groups": "Guruhlar",
    "nav.students": "Talabalar",
    "nav.gifts": "Sovg'alar",
    "nav.management": "Boshqarish",
    "nav.courses": "Kurslar",
    "nav.rooms": "Xonalar",
    "nav.staff": "Hodimlar",
    "nav.coin": "Coin",
    "nav.sendMessage": "Xabar Yuborish",

    // Header & Layout
    "header.add": "Qo'shish",
    "header.search": "Qidirish...",
    "header.logout": "Tizimdan chiqish",
    "header.darkMode": "Tungi rejim",
    "header.lightMode": "Kunduzgi rejim",

    // Pages titles & subtitles
    "title.teachers": "O'qituvchilar",
    "subtitle.teachers": "Ushbu sahifada siz o'qituvchilar ro'yxatini va ularning ma'lumotlarini topasiz.",
    "title.students": "Talabalar",
    "subtitle.students": "Ushbu sahifada siz Talabalar ro'yxatini va ularning ma'lumotlarini topasiz. Har bir Talaba ismi, fanlari va aloqa ma'lumotlari keltirilgan.",
    "title.groups": "Guruhlar",
    "subtitle.groups": "Ushbu sahifada siz o'quv markazidagi barcha guruhlar va ularning dars jadvalini ko'rishingiz mumkin.",
    "title.welcome": "Salom",
    "subtitle.welcome": "EduCoin platformasiga xush kelibsiz",
    "title.createHomework": "Yangi uyga vazifa yaratish",
    "title.dashboard": "Boshqaruv paneli",

    // Button actions
    "btn.addTeacher": "O'qituvchi qo'shish",
    "btn.addGroup": "Guruh qo'shish",
    "btn.addStudent": "Talaba qo'shish",
    "btn.export": "Eksport",

    // Common
    "common.loading": "Yuklanmoqda...",
    "common.noData": "Ma'lumotlar mavjud emas",
    "common.save": "Saqlash",
    "common.cancel": "Bekor qilish",
    "common.delete": "O'chirish",
    "common.edit": "Tahrirlash",
    "common.confirm": "Tasdiqlash"
  },
  ru: {
    // Navigation / Sidebar
    "nav.dashboard": "Главная",
    "nav.teachers": "Учителя",
    "nav.groups": "Группы",
    "nav.students": "Студенты",
    "nav.gifts": "Подарки",
    "nav.management": "Управление",
    "nav.courses": "Курсы",
    "nav.rooms": "Комнаты",
    "nav.staff": "Сотрудники",
    "nav.coin": "Коин",
    "nav.sendMessage": "Отправить сообщение",

    // Header & Layout
    "header.add": "Добавить",
    "header.search": "Поиск...",
    "header.logout": "Выйти",
    "header.darkMode": "Темная тема",
    "header.lightMode": "Светлая тема",

    // Pages titles & subtitles
    "title.teachers": "Учителя",
    "subtitle.teachers": "На этой странице вы найдете список учителей и информацию о них.",
    "title.students": "Студенты",
    "subtitle.students": "На этой странице вы найдете список студентов и информацию о них. Представлены имя, дисциплины и контактные данные каждого студента.",
    "title.groups": "Группы",
    "subtitle.groups": "На этой странице вы можете просмотреть все группы учебного центра и их расписание уроков.",
    "title.welcome": "Привет",
    "subtitle.welcome": "Добро пожаловать на платформу EduCoin",
    "title.createHomework": "Создать новое домашнее задание",
    "title.dashboard": "Панель управления",

    // Button actions
    "btn.addTeacher": "Добавить учителя",
    "btn.addGroup": "Добавить группу",
    "btn.addStudent": "Добавить студента",
    "btn.export": "Экспорт",

    // Common
    "common.loading": "Загрузка...",
    "common.noData": "Нет данных",
    "common.save": "Сохранить",
    "common.cancel": "Отмена",
    "common.delete": "Удалить",
    "common.edit": "Редактировать",
    "common.confirm": "Подтвердить"
  },
  en: {
    // Navigation / Sidebar
    "nav.dashboard": "Dashboard",
    "nav.teachers": "Teachers",
    "nav.groups": "Groups",
    "nav.students": "Students",
    "nav.gifts": "Gifts",
    "nav.management": "Management",
    "nav.courses": "Courses",
    "nav.rooms": "Rooms",
    "nav.staff": "Staff",
    "nav.coin": "Coin",
    "nav.sendMessage": "Send Message",

    // Header & Layout
    "header.add": "Add",
    "header.search": "Search...",
    "header.logout": "Log out",
    "header.darkMode": "Dark mode",
    "header.lightMode": "Light mode",

    // Pages titles & subtitles
    "title.teachers": "Teachers",
    "subtitle.teachers": "On this page, you will find the list of teachers and their information.",
    "title.students": "Students",
    "subtitle.students": "On this page, you will find the list of students and their details. Each student's name, subjects, and contact details are shown.",
    "title.groups": "Groups",
    "subtitle.groups": "On this page, you can view all learning center groups and their class schedules.",
    "title.welcome": "Hello",
    "subtitle.welcome": "Welcome to the EduCoin platform",
    "title.createHomework": "Create New Homework",
    "title.dashboard": "Dashboard",

    // Button actions
    "btn.addTeacher": "Add Teacher",
    "btn.addGroup": "Add Group",
    "btn.addStudent": "Add Student",
    "btn.export": "Export",

    // Common
    "common.loading": "Loading...",
    "common.noData": "No data available",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.confirm": "Confirm"
  }
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return window.localStorage.getItem("app_lang") || "uz";
  });

  useEffect(() => {
    window.localStorage.setItem("app_lang", language);
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations["uz"]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
