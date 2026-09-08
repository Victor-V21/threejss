import { RigidBody } from "@react-three/rapier";

export const wall = (props: any) => {
  return (
    <div {...props}>
      <RigidBody>
        <mesh>
          <></>
        </mesh>
      </RigidBody>
    </div>
  );
};
