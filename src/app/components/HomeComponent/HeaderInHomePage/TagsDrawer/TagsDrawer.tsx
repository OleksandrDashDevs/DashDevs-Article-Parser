import { Drawer } from "@mui/material";

import { CloseCross } from "@/app/shared/CloseCross/CloseCross";

import styles from "./TagsDrawer.module.css";
import { ITagDrawer } from "@/app/interfaces/articles";

export const TagDrawer = ({ openDrawer, toggleDrawer }: ITagDrawer) => {
    const { drawerContainer, titleContainer } = styles;

    return (
        <Drawer
            open={openDrawer}
            onClose={() => toggleDrawer(false)}
            anchor='right'
        >
            <div className={drawerContainer}>
                <div className={titleContainer}>
                    <h2>Список доступних тегів</h2>
                    <CloseCross onClick={() => toggleDrawer(false)} />
                </div>
                {/* <form
                    className='drawer_container_create_entity'
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className='drawer_form_container'>
                        {" "}
                        <TextField
                            type='text'
                            id='title'
                            label='Назва послуги'
                            {...register("title", {
                                required: "Назва послуги є обов'язковою",
                                minLength: {
                                    value: 5,
                                    message: "Мінімум 5 символи",
                                },
                                maxLength: {
                                    value: 120,
                                    message: "Максимум 120 символів",
                                },
                            })}
                            variant='outlined'
                            sx={{
                                ...inputStyles.root,
                                marginBottom: 2,
                            }}
                            error={!!errors.title}
                            helperText={errors.title?.message}
                            fullWidth
                            inputProps={{ maxLength: 120 }}
                        />
                        <TextField
                            type='text'
                            id='price'
                            label='Вартість'
                            variant='outlined'
                            sx={{
                                ...inputStyles.root,
                                marginBottom: 2,
                            }}
                            error={!!errors.price}
                            helperText={errors.price?.message}
                            fullWidth
                            {...register("price", {
                                required: "Ціна обов'язкова",
                                pattern: {
                                    value: /^[0-9]+$/,
                                    message: "Тільки цифри",
                                },
                                maxLength: {
                                    value: 10,
                                    message: "Максимум 10 цифр",
                                },
                            })}
                            inputProps={{ maxLength: 10 }}
                            onFocus={e => {
                                if (e.target.value === "0") {
                                    e.target.value = "";
                                }
                            }}
                            onKeyDown={e => {
                                const allowedKeys = [
                                    "Backspace",
                                    "Delete",
                                    "ArrowLeft",
                                    "ArrowRight",
                                    "Tab",
                                ];

                                if (
                                    !/[0-9]/.test(e.key) &&
                                    !allowedKeys.includes(e.key)
                                ) {
                                    e.preventDefault();
                                }
                            }}
                        />
                        <TextField
                            type='text'
                            id='description'
                            label='Опис'
                            variant='outlined'
                            sx={{
                                ...inputStyles.root,
                                marginBottom: 2,
                            }}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                            fullWidth
                            {...register("description", {
                                pattern: {
                                    value: /^[-–—0-9]*$/,
                                    message: "Лише цифри та символи -, – або —",
                                },
                                maxLength: {
                                    value: 20,
                                    message: "Максимум 20 символів",
                                },
                            })}
                            inputProps={{ maxLength: 20 }}
                            onFocus={e => {
                                if (e.target.value === "0") {
                                    e.target.value = "";
                                }
                            }}
                            onKeyDown={e => {
                                const allowedKeys = [
                                    "Backspace",
                                    "Delete",
                                    "ArrowLeft",
                                    "ArrowRight",
                                    "Tab",
                                ];

                                const isDigit = /[0-9]/.test(e.key);
                                const isDash = ["-", "–", "—"].includes(e.key);

                                if (
                                    !isDigit &&
                                    !isDash &&
                                    !allowedKeys.includes(e.key)
                                ) {
                                    e.preventDefault();
                                }
                            }}
                        />
                        <TextField
                            type='text'
                            id='code'
                            label='Код послуги'
                            variant='outlined'
                            sx={{
                                ...inputStyles.root,
                                marginBottom: 2,
                            }}
                            error={!!errors.code}
                            helperText={errors.code?.message}
                            fullWidth
                            {...register("code", {
                                required: "Код послуги є обов'язковим",
                                validate: value =>
                                    value !== 0 || "Код не може дорівнювати 0",
                                maxLength: {
                                    value: 5,
                                    message: "Максимум 5 символів",
                                },
                            })}
                            inputProps={{ maxLength: 5 }}
                            onFocus={e => {
                                if (e.target.value === "0") {
                                    e.target.value = "";
                                }
                            }}
                        />
                        <FormControl fullWidth sx={{ marginBottom: 2 }}>
                            <InputLabel
                                id='category-label'
                                sx={{
                                    fontFamily:
                                        "'Nunito Sans', sans-serif !important",
                                    color: "#47586E",
                                }}
                            >
                                Категорія
                            </InputLabel>
                            <Controller
                                name='category'
                                control={control}
                                rules={{
                                    required: "Вибір категорії є обов'язковим",
                                }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        labelId='category-label'
                                        label='Категорія'
                                        error={!!errors.category}
                                        value={field.value}
                                        onChange={field.onChange}
                                        MenuProps={{
                                            PaperProps: {
                                                sx: {
                                                    "& .MuiMenuItem-root": {
                                                        height: 40,
                                                        fontFamily:
                                                            "'Nunito Sans', sans-serif !important",
                                                        fontWeight: 400,
                                                        fontSize: "14px",
                                                        lineHeight: "20px",
                                                        transition:
                                                            "all 0.3s linear",
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                    },
                                                },
                                            },
                                        }}
                                        sx={{
                                            ...selectorStyles,
                                            width: "100%",
                                            height: "56px",
                                        }}
                                        IconComponent={props => <Icon />}
                                    >
                                        {categoriesInCreateService.map(item => (
                                            <MenuItem
                                                value={item.name}
                                                key={item.id}
                                                id={item.id}
                                            >
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                            {errors.category && (
                                <FormHelperText error>
                                    {errors.category.message}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </div>

                    <Button
                        text={
                            isEditService ? "Зберегти зміни" : "Додати послугу"
                        }
                        variant='approved'
                        type='submit'
                        disabled={isLocalLoading}
                        isLoading={isLocalLoading}
                    />
                </form> */}
            </div>
        </Drawer>
    );
};
