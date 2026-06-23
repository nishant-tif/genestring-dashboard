import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import uiReducer from "@/store/slices/uiSlice";
import dashboardReducer from "@/store/slices/dashboardSlice";
import modelsReducer from "@/store/slices/modelsSlice";
import organizationsReducer from "@/store/slices/organizationsSlice";
import policiesReducer from "@/store/slices/policiesSlice";
import articleReducer from "@/store/slices/articleSlice";
import countriesReducer from "@/store/slices/countriesSlice";
import statesReducer from "@/store/slices/stateSlice";
import citiesReducer from "@/store/slices/citySlice";
import categoriesReducer from "@/store/slices/categorySlice";
import authorsReducer from "@/store/slices/authorSlice";
import userReducer from "@/store/slices/userSlice";
import widgetReducer from "@/store/slices/widgetSlice";
import regulationReducer from "@/store/slices/regulationSlice";
import numbersWidgetReducer from "@/store/slices/numberWidgetSlice";
import contentWidgetsReducer from "@/store/slices/contentWidgetsSlice";
import tagsReducer from "@/store/slices/tagSlice";
import teamReducer from "@/store/slices/teamSlice";
import testimonialsReducer from "@/store/slices/testimonialsSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    dashboard: dashboardReducer,
    models: modelsReducer,
    organizations: organizationsReducer,
    policies: policiesReducer,
    articles: articleReducer,
    countries: countriesReducer,
    states: statesReducer,
    cities: citiesReducer,
    categories: categoriesReducer,
    author: authorsReducer,
    user: userReducer,
    widget: widgetReducer,
    regulations: regulationReducer,
    numbersWidget: numbersWidgetReducer,
    contentWidgets: contentWidgetsReducer,
    tags: tagsReducer,
    team: teamReducer,
    testimonials: testimonialsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
