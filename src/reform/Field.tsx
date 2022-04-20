import {
	ChangeEventHandler,
	Children,
	cloneElement,
	CSSProperties,
	ReactElement,
	useState,
} from 'react';
import { FieldLabel } from './FieldLabel';
import { useFormContext } from './FormProvider';
import { FormValues } from './interfaces/FormValues';
import { FieldValue } from './types/FieldValue';

export type FieldOrientation =
	| 'row'
	| 'column'
	| 'column-reverse'
	| 'row-reverse';
export interface FieldProps {
	children: ReactElement[] | ReactElement;
	name: string;
	style?: CSSProperties;
	orientation?: FieldOrientation;
}

export const Field = ({
	children,
	name,
	style,
	orientation = 'column',
}: FieldProps) => {
	const { form } = useFormContext();

	const childrenElements = Array.isArray(children) ? children : [children];

	const [value, setValue] = useState<FieldValue>(
		(form.values as FormValues)[name] as FieldValue
	);

	return (
		<div
			style={{
				display: 'flex',
				gap: 8,
				flexDirection: orientation,
				alignItems: orientation === 'column' ? 'normal' : 'center',
				...style,
			}}
		>
			{Children.map(childrenElements, (child) => {
				if (child.type === FieldLabel) {
					return cloneElement(child, {
						...child.props,
						htmlFor: name,
					});
				}

				return cloneElement<{
					onChange?: ChangeEventHandler<HTMLInputElement>;
				}>(child, {
					...child.props,
					name,
					id: name,
					value: value || '',
					checked: !!value,
					onChange: ({ target }) => {
						let value: FieldValue = target.value;
						if (child.props.type === 'checkbox') {
							value = target.checked;
						}
						setValue(value);
						form.values = { ...form.values, [name]: value };
					},
				});
			})}
		</div>
	);
};
